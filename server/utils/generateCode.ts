/**
 * Génère un code unique de room (5 caractères alphanumériques)
 */

export function generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
}

/**
 * Valide un code de room
 */
export function isValidRoomCode(code: string): boolean {
    return /^[A-Z0-9]{5}$/.test(code);
}
