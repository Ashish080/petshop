import { brandConfig } from '@/config/brand';
import { themeConfig } from '@/config/theme';

export default function LoginButton() {
    return (
        <button
            className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ${themeConfig.radius.full} ${themeConfig.shadows.hover}`}
            style={{ backgroundColor: '#FFC107', color: 'white' }}
            aria-label="Login"
            onClick={() => {
                // Add your login logic here
                console.log('Login button clicked!');
            }}
        >
            Login
        </button>
    );
}
