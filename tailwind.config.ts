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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
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
					foreground: 'hsl(var(--accent-foreground))'
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
				lime: {
					DEFAULT: 'hsl(var(--lime))',
					foreground: 'hsl(var(--lime-foreground))'
				},
				'dark-bg': 'hsl(var(--dark-bg))',
				'dark-bg-light': 'hsl(var(--dark-bg-light))',
				'dark-bg-deep': 'hsl(var(--dark-bg-deep))',
				'dark-card': 'hsl(var(--dark-card))',
				'dark-border': 'hsl(var(--dark-border))',
				'dark-border-light': 'hsl(var(--dark-border-light))',
				teal: 'hsl(var(--teal))',
				// V2 Anima Export Colors
				"colors-neutral-25": "var(--colors-neutral-25)",
				"colors-neutral-400": "var(--colors-neutral-400)",
				"colors-neutral-700": "var(--colors-neutral-700)",
				"colors-neutral-800": "var(--colors-neutral-800)",
				"colors-primary-400": "var(--colors-primary-400)",
				"colors-primary-700": "var(--colors-primary-700)",
				"colors-primary-900": "var(--colors-primary-900)",
				"colors-secondary-900": "var(--colors-secondary-900)",
				"colors-translucent-dark-2": "var(--colors-translucent-dark-2)",
				"colors-translucent-dark-4": "var(--colors-translucent-dark-4)",
				"colors-translucent-dark-8": "var(--colors-translucent-dark-8)",
				"colors-translucent-dark-16": "var(--colors-translucent-dark-16)",
				"colors-translucent-dark-56": "var(--colors-translucent-dark-56)",
				"colors-translucent-light-2": "var(--colors-translucent-light-2)",
				"colors-translucent-light-24": "var(--colors-translucent-light-24)",
				"colors-translucent-light-56": "var(--colors-translucent-light-56)",
				"colors-translucent-light-80": "var(--colors-translucent-light-80)",
				"colors-translucent-light-92": "var(--colors-translucent-light-92)",
				"colors-others-wordpress-0": "var(--colors-others-wordpress-0)",
				"colors-others-yellow-400": "var(--colors-others-yellow-400)",
				"colors-neutral-50": "var(--colors-neutral-50)",
				"colors-neutral-100": "var(--colors-neutral-100)",
				"colors-neutral-500": "var(--colors-neutral-500)",
				"colors-neutral-600": "var(--colors-neutral-600)",
				"colors-primary-100": "var(--colors-primary-100)",
				"colors-primary-500": "var(--colors-primary-500)",
				"colors-primary-800": "var(--colors-primary-800)",
				"colors-brand-tertiary": "var(--colors-brand-tertiary)",
				"colors-translucent-light-4": "var(--colors-translucent-light-4)",
				"colors-translucent-light-8": "var(--colors-translucent-light-8)",
				"colors-translucent-light-64": "var(--colors-translucent-light-64)",
				"colors-translucent-light-72": "var(--colors-translucent-light-72)",
			},
			fontFamily: {
				"body-extra-small-m": "var(--body-extra-small-m-font-family)",
				"body-regular": "var(--body-regular-font-family)",
				"heading-h2": "var(--heading-h2-font-family)",
				"heading-h4": "var(--heading-h4-font-family)",
				"body-small": "var(--body-small-font-family)",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'section': 'var(--section-py)',
				'section-sm': 'var(--section-py-sm)',
				'section-lg': 'var(--section-py-lg)',
			},
			maxWidth: {
				'container': 'var(--container-max)',
				'container-narrow': 'var(--container-narrow)',
				'container-wide': 'var(--container-wide)',
			},
			gap: {
				'grid-sm': 'var(--grid-gap-sm)',
				'grid-md': 'var(--grid-gap-md)',
				'grid-lg': 'var(--grid-gap-lg)',
				'grid-xl': 'var(--grid-gap-xl)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'marquee': {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-50%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'marquee': 'marquee 30s linear infinite'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
	],
} satisfies Config;
