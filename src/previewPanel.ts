import * as vscode from 'vscode';
import * as path from 'path';
import { Generator } from './generator';

export class PreviewPanel {
    public static readonly viewType = 'rapidapi.preview';
    
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _generator: Generator;

    public static createOrShow(extensionUri: vscode.Uri, generator: Generator) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (PreviewPanel.currentPanel) {
            PreviewPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        PreviewPanel.currentPanel = new PreviewPanel(extensionUri, generator);
    }

    private static currentPanel: PreviewPanel | undefined;

    constructor(extensionUri: vscode.Uri, generator: Generator) {
        this._panel = vscode.window.createWebviewPanel(
            PreviewPanel.viewType,
            'RapidAPI Preview',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );
        this._extensionUri = extensionUri;
        this._generator = generator;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            () => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'copyToClipboard':
                        await vscode.env.clipboard.writeText(message.text);
                        vscode.window.showInformationMessage('Copied to clipboard!');
                        return;
                    
                    case 'insertAtCursor':
                        const editor = vscode.window.activeTextEditor;
                        if (editor) {
                            await editor.edit(editBuilder => {
                                editBuilder.insert(editor.selection.active, message.text);
                            });
                            vscode.window.showInformationMessage('Code inserted at cursor!');
                        } else {
                            vscode.window.showWarningMessage('No active editor to insert code');
                        }
                        return;
                    
                    case 'saveToFile':
                        const uri = await vscode.window.showSaveDialog({
                            defaultUri: vscode.Uri.file(path.join(vscode.workspace.rootPath || '', `${message.filename || 'api-client'}.ts`)),
                            filters: {
                                'TypeScript': ['ts'],
                                'JavaScript': ['js'],
                                'All Files': ['*']
                            }
                        });
                        
                        if (uri) {
                            await vscode.workspace.fs.writeFile(uri, Buffer.from(message.text, 'utf8'));
                            vscode.window.showInformationMessage(`Saved to ${uri.fsPath}`);
                        }
                        return;
                    
                    case 'generateCode':
                        await this._generateAndDisplayCode(message.data);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public reveal() {
        this._panel.reveal();
    }

    public dispose() {
        PreviewPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _generateAndDisplayCode(data: any) {
        try {
            // Generate code based on the data
            const generatedCode = this._generator.generateApiCall(data);
            
            // Update the webview with the generated code
            this._panel.webview.postMessage({
                command: 'updateGeneratedCode',
                code: generatedCode
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Error generating code: ${error}`);
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.title = 'RapidAPI Preview';
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <title>RapidAPI Preview</title>
            </head>
            <body>
                <div class="container">
                    <header>
                        <h1>🚀 RapidAPI Generator</h1>
                        <p>Generate, preview, and manage your API integrations</p>
                    </header>

                    <div class="tabs">
                        <button class="tab-button active" onclick="openTab(event, 'generator')">Generator</button>
                        <button class="tab-button" onclick="openTab(event, 'preview')">Preview</button>
                        <button class="tab-button" onclick="openTab(event, 'examples')">Examples</button>
                        <button class="tab-button" onclick="openTab(event, 'settings')">Settings</button>
                    </div>

                    <div id="generator" class="tab-content active">
                        <h2>API Generator</h2>
                        
                        <div class="form-group">
                            <label for="apiUrl">API URL or OpenAPI Spec URL:</label>
                            <input type="text" id="apiUrl" placeholder="https://rapidapi.com/api/... or https://petstore.swagger.io/v2/swagger.json">
                            <button onclick="generateFromUrl()">Generate</button>
                        </div>

                        <div class="form-group">
                            <label for="apiMethod">HTTP Method:</label>
                            <select id="apiMethod">
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="PATCH">PATCH</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="apiPath">Endpoint Path:</label>
                            <input type="text" id="apiPath" placeholder="/api/endpoint">
                        </div>

                        <div class="form-group">
                            <label for="apiHeaders">Headers (JSON):</label>
                            <textarea id="apiHeaders" rows="4" placeholder='{"Content-Type": "application/json"}'></textarea>
                        </div>

                        <div class="form-group">
                            <label for="apiBody">Request Body (JSON):</label>
                            <textarea id="apiBody" rows="6" placeholder='{"key": "value"}'></textarea>
                        </div>

                        <div class="button-group">
                            <button onclick="generateCode()" class="primary">Generate Code</button>
                            <button onclick="testEndpoint()">Test Endpoint</button>
                            <button onclick="clearForm()">Clear</button>
                        </div>
                    </div>

                    <div id="preview" class="tab-content">
                        <h2>Generated Code Preview</h2>
                        
                        <div class="language-selector">
                            <label for="codeLanguage">Language:</label>
                            <select id="codeLanguage" onchange="updateCodeLanguage()">
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="curl">cURL</option>
                            </select>
                        </div>

                        <div class="code-preview">
                            <div class="code-header">
                                <span class="code-title">Generated Code</span>
                                <div class="code-actions">
                                    <button onclick="copyCode()" title="Copy to clipboard">📋 Copy</button>
                                    <button onclick="insertCode()" title="Insert at cursor">📝 Insert</button>
                                    <button onclick="saveCode()" title="Save to file">💾 Save</button>
                                </div>
                            </div>
                            <pre><code id="generatedCode">// Generated code will appear here...</code></pre>
                        </div>

                        <div class="response-preview" style="display: none;">
                            <h3>Expected Response</h3>
                            <pre><code id="expectedResponse"></code></pre>
                        </div>
                    </div>

                    <div id="examples" class="tab-content">
                        <h2>API Examples</h2>
                        
                        <div class="examples-list">
                            <div class="example-item">
                                <h3>Weather API</h3>
                                <p>Get current weather information</p>
                                <button onclick="loadExample('weather')">Load Example</button>
                            </div>
                            
                            <div class="example-item">
                                <h3>News API</h3>
                                <p>Fetch latest news articles</p>
                                <button onclick="loadExample('news')">Load Example</button>
                            </div>
                            
                            <div class="example-item">
                                <h3>User API</h3>
                                <p>Manage user accounts</p>
                                <button onclick="loadExample('users')">Load Example</button>
                            </div>
                        </div>
                    </div>

                    <div id="settings" class="tab-content">
                        <h2>Settings</h2>
                        
                        <div class="form-group">
                            <label for="rapidApiKey">RapidAPI Key:</label>
                            <input type="password" id="rapidApiKey" placeholder="Enter your RapidAPI key">
                        </div>

                        <div class="form-group">
                            <label for="rapidApiHost">RapidAPI Host:</label>
                            <input type="text" id="rapidApiHost" placeholder="api.example.com">
                        </div>

                        <div class="form-group">
                            <label for="outputDir">Output Directory:</label>
                            <input type="text" id="outputDir" value="./src/api">
                        </div>

                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="autoGenerateTypes" checked>
                                Auto-generate TypeScript types
                            </label>
                        </div>

                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="debugMode">
                                Enable debug mode
                            </label>
                        </div>

                        <button onclick="saveSettings()" class="primary">Save Settings</button>
                    </div>

                    <div class="status-bar">
                        <span id="statusText">Ready</span>
                        <div class="status-actions">
                            <button onclick="openDocumentation()">📚 Docs</button>
                            <button onclick="reportIssue()">🐛 Report Issue</button>
                        </div>
                    </div>
                </div>

                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }

    public onDidDispose(callback: () => void) {
        this._panel.onDidDispose(callback);
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}