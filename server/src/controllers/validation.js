//help me create validation phone and email, and strong password
class Validation {
    static async validPhone(phone) {
        const phoneRegex = /^[0-9]{10,15}$/; // Example regex for phone validation
        return phoneRegex.test(phone);
    }
    static async validEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Example regex for email validation
        return emailRegex.test(email);
    }
    static async validPassword(password) {
        // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
}
export default Validation;