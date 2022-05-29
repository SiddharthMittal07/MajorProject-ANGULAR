interface Information {
    main: string;
    applications: string[];
    pros: string[];
    cons: string[];
}

export interface Algorithm {
    algorithm: string;
    confusion_matrix: number[];
    information: Information;
}