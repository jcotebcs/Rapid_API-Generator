import * as vscode from 'vscode';
import { Generator } from './generator';
import { RapidApiClient } from './rapidapiClient';
import { setupEnvironment } from './setupEnv';
import { PreviewPanel } from './previewPanel';
import { ApiExplorerProvider } from './apiExplorer';

let generator: Generator;
let rapidApiClient: RapidApiClient;
let previewPanel: PreviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('RapidAPI Generator extension is now active!');

    // Initialize core components
    generator = new Generator();
    rapidApiClient = new RapidApiClient();
    
    // Set context for when extension is enabled
    vscode.commands.executeCommand('setContext', 'rapidapi:enabled', true);

    // Initialize API Explorer Tree View
    const apiExplorerProvider = new ApiExplorerProvider();
    vscode.window.createTreeView('rapidapiExplorer', {
        treeDataProvider: apiExplorerProvider,
        showCollapseAll: true
    });

    // Register commands
    const disposables = [
        // Generate RapidAPI Endpoint command
        vscode.commands.registerCommand('rapidapi.generateEndpoint', async () => {
            try {
                const apiUrl = await vscode.window.showInputBox({
                    prompt: 'Enter RapidAPI URL or OpenAPI spec URL',
                    placeHolder: 'https://rapidapi.com/api/...',
                    validateInput: (value) => {
                        if (!value || !value.includes('http')) {
                            return 'Please enter a valid URL';
                        }
                        return null;
                    }
                });

                if (apiUrl) {
                    await vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                        title: 'Generating RapidAPI endpoint...',
                        cancellable: false
                    }, async (progress) => {
                        progress.report({ increment: 25, message: 'Parsing OpenAPI spec...' });
                        const result = await generator.generateFromUrl(apiUrl);
                        
                        progress.report({ increment: 50, message: 'Generating TypeScript interfaces...' });
                        await generator.generateTypes(result.schema);
                        
                        progress.report({ increment: 75, message: 'Creating API client...' });
                        await generator.generateClient(result);
                        
                        progress.report({ increment: 100, message: 'Complete!' });
                    });

                    vscode.window.showInformationMessage('RapidAPI endpoint generated successfully!');
                    apiExplorerProvider.refresh();
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Error generating endpoint: ${error}`);
            }
        }),

        // Setup Environment command
        vscode.commands.registerCommand('rapidapi.setupEnvironment', async () => {
            try {
                await setupEnvironment();
                vscode.window.showInformationMessage('Environment setup completed!');
            } catch (error) {
                vscode.window.showErrorMessage(`Error setting up environment: ${error}`);
            }
        }),

        // Open Preview Panel command
        vscode.commands.registerCommand('rapidapi.openPreview', () => {
            if (previewPanel) {
                previewPanel.reveal();
            } else {
                previewPanel = new PreviewPanel(context.extensionUri, generator);
                previewPanel.onDidDispose(() => {
                    previewPanel = undefined;
                });
            }
        }),

        // Refresh API Explorer command
        vscode.commands.registerCommand('rapidapi.refreshApiExplorer', () => {
            apiExplorerProvider.refresh();
        }),

        // Insert API call at cursor
        vscode.commands.registerCommand('rapidapi.insertApiCall', async (endpoint: any) => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const apiCall = generator.generateApiCall(endpoint);
                await editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, apiCall);
                });
                vscode.window.showInformationMessage('API call inserted successfully!');
            }
        }),

        // Copy API call to clipboard
        vscode.commands.registerCommand('rapidapi.copyApiCall', async (endpoint: any) => {
            const apiCall = generator.generateApiCall(endpoint);
            await vscode.env.clipboard.writeText(apiCall);
            vscode.window.showInformationMessage('API call copied to clipboard!');
        })
    ];

    context.subscriptions.push(...disposables);

    // Auto-setup environment on first activation
    const hasSetup = context.globalState.get('rapidapi.hasSetup', false);
    if (!hasSetup) {
        vscode.window.showInformationMessage(
            'Welcome to RapidAPI Generator! Would you like to set up your environment?',
            'Yes', 'Later'
        ).then(selection => {
            if (selection === 'Yes') {
                vscode.commands.executeCommand('rapidapi.setupEnvironment');
                context.globalState.update('rapidapi.hasSetup', true);
            }
        });
    }
}

export function deactivate() {
    if (previewPanel) {
        previewPanel.dispose();
    }
}