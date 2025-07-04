import {jwtDecode} from 'jwt-decode';


export function getId(token: string): string {
    if (token) {
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        return userId;
    }

    return '';
}