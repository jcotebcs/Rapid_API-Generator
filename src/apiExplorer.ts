import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class ApiExplorerProvider implements vscode.TreeDataProvider<ApiItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ApiItem | undefined | null | void> = new vscode.EventEmitter<ApiItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ApiItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private workspaceRoot: string | undefined;

    constructor() {
        this.workspaceRoot = vscode.workspace.rootPath;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ApiItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ApiItem): Thenable<ApiItem[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No workspace found');
            return Promise.resolve([]);
        }

        if (!element) {
            // Root level - show main categories
            return Promise.resolve([
                new ApiItem(
                    'Generated APIs',
                    vscode.TreeItemCollapsibleState.Expanded,
                    'category',
                    'generated'
                ),
                new ApiItem(
                    'RapidAPI Hub',
                    vscode.TreeItemCollapsibleState.Collapsed,
                    'category',
                    'rapidapi'
                ),
                new ApiItem(
                    'Recent',
                    vscode.TreeItemCollapsibleState.Collapsed,
                    'category',
                    'recent'
                )
            ]);
        } else {
            return this.getApiChildren(element);
        }
    }

    private async getApiChildren(element: ApiItem): Promise<ApiItem[]> {
        switch (element.contextValue) {
            case 'generated':
                return this.getGeneratedApis();
            
            case 'rapidapi':
                return this.getRapidApiCategories();
            
            case 'recent':
                return this.getRecentApis();
            
            case 'rapidapi-category':
                return this.getRapidApisByCategory(element.label as string);
            
            default:
                return [];
        }
    }

    private async getGeneratedApis(): Promise<ApiItem[]> {
        if (!this.workspaceRoot) return [];

        const config = vscode.workspace.getConfiguration('rapidapi');
        const outputDir = config.get('outputDirectory', './src/api');
        const apiDir = path.join(this.workspaceRoot, outputDir);

        if (!fs.existsSync(apiDir)) {
            return [new ApiItem(
                'No APIs generated yet',
                vscode.TreeItemCollapsibleState.None,
                'placeholder'
            )];
        }

        try {
            const files = await fs.promises.readdir(apiDir);
            const apiFiles = files.filter(file => file.endsWith('Client.ts'));
            
            if (apiFiles.length === 0) {
                return [new ApiItem(
                    'No APIs generated yet',
                    vscode.TreeItemCollapsibleState.None,
                    'placeholder'
                )];
            }

            return apiFiles.map(file => {
                const apiName = file.replace('Client.ts', '');
                const item = new ApiItem(
                    apiName,
                    vscode.TreeItemCollapsibleState.None,
                    'generated-api'
                );
                
                item.command = {
                    command: 'vscode.open',
                    title: 'Open',
                    arguments: [vscode.Uri.file(path.join(apiDir, file))]
                };
                
                item.tooltip = `Open ${apiName} API client`;
                item.iconPath = new vscode.ThemeIcon('file-code');
                
                return item;
            });
        } catch (error) {
            return [new ApiItem(
                'Error loading APIs',
                vscode.TreeItemCollapsibleState.None,
                'error'
            )];
        }
    }

    private getRapidApiCategories(): Promise<ApiItem[]> {
        const categories = [
            'Weather',
            'Finance',
            'Social Media',
            'News',
            'Sports',
            'Entertainment',
            'E-commerce',
            'Travel',
            'Food & Recipes',
            'Health & Fitness',
            'Education',
            'Business',
            'Communication',
            'Data & Analytics',
            'Machine Learning',
            'IoT',
            'Gaming',
            'Photography',
            'Music',
            'Video'
        ];

        return Promise.resolve(
            categories.map(category => {
                const item = new ApiItem(
                    category,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    'rapidapi-category'
                );
                item.iconPath = new vscode.ThemeIcon('folder');
                return item;
            })
        );
    }

    private getRecentApis(): Promise<ApiItem[]> {
        // This would typically load from a cache or settings
        // For now, return mock data
        const recentApis = [
            { name: 'Weather API', url: 'https://rapidapi.com/weatherapi/api/weatherapi-com/' },
            { name: 'News API', url: 'https://rapidapi.com/newscatcher-api-newscatcher-api-default/api/newscatcher/' },
            { name: 'Currency API', url: 'https://rapidapi.com/fixer/api/fixer/' }
        ];

        return Promise.resolve(
            recentApis.map(api => {
                const item = new ApiItem(
                    api.name,
                    vscode.TreeItemCollapsibleState.None,
                    'recent-api'
                );
                
                item.tooltip = api.url;
                item.iconPath = new vscode.ThemeIcon('clock');
                
                item.command = {
                    command: 'rapidapi.generateEndpoint',
                    title: 'Generate',
                    arguments: [api.url]
                };
                
                return item;
            })
        );
    }

    private getRapidApisByCategory(category: string): Promise<ApiItem[]> {
        // This would typically fetch from RapidAPI
        // For now, return mock data based on category
        const mockApis = this.getMockApisByCategory(category);

        return Promise.resolve(
            mockApis.map(api => {
                const item = new ApiItem(
                    api.name,
                    vscode.TreeItemCollapsibleState.None,
                    'rapidapi-api'
                );
                
                item.description = api.description;
                item.tooltip = `${api.description}\nRating: ${api.rating}/5`;
                item.iconPath = new vscode.ThemeIcon('globe');
                
                item.command = {
                    command: 'rapidapi.generateEndpoint',
                    title: 'Generate',
                    arguments: [api.url]
                };
                
                return item;
            })
        );
    }

    private getMockApisByCategory(category: string): any[] {
        const apiDatabase: Record<string, any[]> = {
            'Weather': [
                { name: 'WeatherAPI', description: 'Real-time weather data', rating: 4.8, url: 'https://rapidapi.com/weatherapi/api/weatherapi-com/' },
                { name: 'OpenWeatherMap', description: 'Global weather service', rating: 4.5, url: 'https://rapidapi.com/community/api/open-weather-map/' },
                { name: 'AccuWeather', description: 'Accurate weather forecasts', rating: 4.7, url: 'https://rapidapi.com/accuweather/api/accuweather/' }
            ],
            'Finance': [
                { name: 'Alpha Vantage', description: 'Stock market data', rating: 4.6, url: 'https://rapidapi.com/alphavantage/api/alpha-vantage/' },
                { name: 'Fixer.io', description: 'Currency exchange rates', rating: 4.4, url: 'https://rapidapi.com/fixer/api/fixer/' },
                { name: 'Yahoo Finance', description: 'Financial market data', rating: 4.3, url: 'https://rapidapi.com/apidojo/api/yahoo-finance1/' }
            ],
            'News': [
                { name: 'NewsAPI', description: 'Live news headlines', rating: 4.5, url: 'https://rapidapi.com/newsapi/api/newsapi/' },
                { name: 'NewsCatcher', description: 'News aggregation service', rating: 4.2, url: 'https://rapidapi.com/newscatcher-api-newscatcher-api-default/api/newscatcher/' },
                { name: 'Bing News', description: 'Microsoft news search', rating: 4.1, url: 'https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/bing-news-search1/' }
            ]
        };

        return apiDatabase[category] || [
            { name: `Sample ${category} API`, description: `Example API for ${category}`, rating: 4.0, url: `https://rapidapi.com/sample/${category.toLowerCase()}/` }
        ];
    }
}

export class ApiItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue?: string,
        public readonly categoryId?: string
    ) {
        super(label, collapsibleState);
        this.contextValue = contextValue;
    }
}