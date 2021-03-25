import { MenuItem } from 'primeng/api';

export interface Breadcrumb extends MenuItem {
    updateParam?: string;
    onlyParam?: boolean;
}