
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Orbitron', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'Consolas', 'monospace'],
				neural: ['Exo 2', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))',
					shadow: 'hsl(var(--primary-shadow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					glow: 'hsl(var(--secondary-glow))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					glow: 'hsl(var(--accent-glow))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Neural Network Color System
				neural: {
					primary: 'hsl(263, 100%, 65%)',
					secondary: 'hsl(200, 100%, 55%)',
					accent: 'hsl(45, 100%, 60%)',
					success: 'hsl(142, 85%, 55%)',
					warning: 'hsl(38, 100%, 60%)',
					danger: 'hsl(0, 85%, 60%)',
					info: 'hsl(217, 91%, 60%)',
					glow: 'hsl(263, 100%, 65% / 0.3)',
					shadow: 'hsl(263, 100%, 15% / 0.6)',
				},
				// Cyber Colors
				cyber: {
					neon: 'hsl(180, 100%, 50%)',
					'neon-pink': 'hsl(320, 100%, 50%)',
					'neon-green': 'hsl(120, 100%, 50%)',
					'neon-blue': 'hsl(240, 100%, 50%)',
					'neon-orange': 'hsl(30, 100%, 50%)',
					matrix: 'hsl(120, 100%, 25%)',
				},
				// Glass Morphism
				glass: {
					bg: 'hsl(var(--glass-bg))',
					border: 'hsl(var(--glass-border))',
				},
				// Status Enhanced
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				error: 'hsl(0, 85%, 60%)',
				info: 'hsl(217, 91%, 60%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'neural': 'var(--shadow-neural)',
				'glow': 'var(--shadow-glow)',
				'luxury': 'var(--shadow-luxury)',
				'cyber': '0 0 30px hsl(180 100% 50% / 0.5), 0 0 60px hsl(180 100% 50% / 0.2)',
				'neon': '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor',
				'hologram': '0 0 40px hsl(var(--primary) / 0.4), inset 0 0 40px hsl(var(--secondary) / 0.1)',
				'glass': '0 8px 32px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.1)',
				'depth': '0 20px 40px -12px hsl(0 0% 0% / 0.4), 0 0 0 1px hsl(0 0% 100% / 0.05)',
			},
			backdropBlur: {
				'neural': 'var(--blur-subtle)',
				'strong': 'var(--blur-strong)',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'shimmer': 'shimmer 2s linear infinite',
				'float': 'float 6s ease-in-out infinite',
				'gradient': 'gradient 15s ease infinite',
				'neural-pulse': 'neural-pulse 3s ease-in-out infinite',
				'cyber-scan': 'cyber-scan 2s linear infinite',
				'hologram': 'hologram 4s ease-in-out infinite',
				'matrix-rain': 'matrix-rain 20s linear infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
				'data-flow': 'data-flow 3s linear infinite',
				'neural-wave': 'neural-wave 6s ease-in-out infinite',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'gradient': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'neural-pulse': {
					'0%, 100%': { 
						opacity: '1', 
						boxShadow: '0 0 20px hsl(var(--primary) / 0.4)' 
					},
					'50%': { 
						opacity: '0.8', 
						boxShadow: '0 0 40px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--secondary) / 0.3)' 
					}
				},
				'cyber-scan': {
					'0%': { transform: 'translateX(-100%) skewX(-15deg)' },
					'100%': { transform: 'translateX(200%) skewX(-15deg)' }
				},
				'hologram': {
					'0%, 100%': { 
						opacity: '1',
						filter: 'hue-rotate(0deg) brightness(1)'
					},
					'25%': { 
						opacity: '0.8',
						filter: 'hue-rotate(90deg) brightness(1.2)'
					},
					'50%': { 
						opacity: '0.9',
						filter: 'hue-rotate(180deg) brightness(0.9)'
					},
					'75%': { 
						opacity: '0.85',
						filter: 'hue-rotate(270deg) brightness(1.1)'
					}
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100vh)' }
				},
				'glow-pulse': {
					'0%': { 
						boxShadow: '0 0 5px hsl(var(--primary) / 0.5)'
					},
					'100%': { 
						boxShadow: '0 0 25px hsl(var(--primary) / 0.8), 0 0 50px hsl(var(--secondary) / 0.4)'
					}
				},
				'data-flow': {
					'0%': { 
						transform: 'translateX(-100%) scaleX(0)',
						opacity: '0'
					},
					'50%': { 
						transform: 'translateX(0%) scaleX(1)',
						opacity: '1'
					},
					'100%': { 
						transform: 'translateX(100%) scaleX(0)',
						opacity: '0'
					}
				},
				'neural-wave': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotate(0deg)',
						borderRadius: '50%'
					},
					'33%': { 
						transform: 'translateY(-10px) rotate(120deg)',
						borderRadius: '30%'
					},
					'66%': { 
						transform: 'translateY(5px) rotate(240deg)',
						borderRadius: '70%'
					}
				}
			},
			backgroundImage: {
				'neural-gradient': 'var(--gradient-primary)',
				'luxury-gradient': 'var(--gradient-luxury)',
				'hero-neural': 'var(--gradient-neural)',
				'cyber-grid': 'linear-gradient(90deg, transparent 24%, hsl(var(--primary) / 0.1) 25%, hsl(var(--primary) / 0.1) 26%, transparent 27%, transparent 74%, hsl(var(--primary) / 0.1) 75%, hsl(var(--primary) / 0.1) 76%, transparent 77%, transparent), linear-gradient(transparent 24%, hsl(var(--primary) / 0.1) 25%, hsl(var(--primary) / 0.1) 26%, transparent 27%, transparent 74%, hsl(var(--primary) / 0.1) 75%, hsl(var(--primary) / 0.1) 76%, transparent 77%, transparent)',
				'hologram-mesh': 'radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--secondary) / 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 80%, hsl(var(--accent) / 0.2) 0%, transparent 50%)',
				'data-stream': 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
