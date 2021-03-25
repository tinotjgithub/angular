export class ClaimsChecklist {
    Professional: any[];
    "Institutional-IP": any[];
    "Institutional-OP": any[];
    Others: any[];

    constructor() {
        this.Professional = [];
        this["Institutional-IP"] = [];
        this["Institutional-OP"] = [];
        this.Others = [];
    }

    public static initialize() {
        return new ClaimsChecklist();
    }
}

export interface InventoryStatus {
    totalClaimsCount: number;
    manualClaimsCount: number;
    adjustedClaimsCount: number;
    claimSource: ClaimSource;
    claimType: ClaimType;
    claimDecision: ClaimDecision;
}

export interface ClaimDecision {
    Paid?: number;
    Deny?: number;
}

export interface ClaimSource {
    Paper?: number;
    EDI?: number;
}

export interface ClaimType {
    Others?: number;
    Professional?: number;
    'Institutional-IP'?: number;
    'Institutional-OP'?: number;
}

export const FILE_POSITION = {
    // tslint:disable: object-literal-key-quotes
    '1': 'attachmentOne',
    '2': 'attachmentTwo',
    '3': 'attachmentThree',
    '4': 'attachmentFour',
    '5': 'attachmentFive',
    '6': 'attachmentSix'
};

export const FILE_POSITION_NO = {
    // tslint:disable: object-literal-key-quotes
    'attachmentOne': 1,
    'attachmentTwo': 2,
    'attachmentThree': 3,
    'attachmentFour': 4,
    'attachmentFive': 5,
    'attachmentSix': 6
};

export const FILE_EXTENSIONS = ['jpg', 'png', 'txt', 'pdf', 'zip', 'doc', 'docx', 'xls', 'xlsx'];

