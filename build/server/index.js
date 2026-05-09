import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, FileText, Heart, Image, Lock, Pause, Play, Settings, Trash2, Unlock, Upload, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), streamTimeout + 1e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links
});
var links = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Dancing+Script:wght@400..700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
	}
];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack;
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "pt-16 p-4 container mx-auto",
		children: [
			/* @__PURE__ */ jsx("h1", { children: message }),
			/* @__PURE__ */ jsx("p", { children: details }),
			stack
		]
	});
});
//#endregion
//#region app/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region app/components/ui/Background.tsx
/**
* Background — Cinematic ambient atmosphere layer.
*
* PERFORMANCE OPTIMIZATIONS v2:
* - Reduced particles from 40 to 18 (55% fewer DOM nodes)
* - Removed heart emoji particles (text rendering is expensive)
* - All particles use CSS @keyframes with transform/opacity ONLY (GPU-composited)
* - Gradient blobs use CSS animations (no Framer Motion)
* - Removed box-shadow from star particles (shadow is expensive per-particle)
* - useMemo for particle data = zero re-computation
* - All overlay layers are purely static (no JS)
*/
function Background({ children, className, flow = false }) {
	const particles = useMemo(() => Array.from({ length: 18 }).map((_, i) => {
		const type = i < 12 ? "dust" : "star";
		return {
			id: i,
			type,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: type === "dust" ? Math.random() * 3 + 1 : Math.random() * 2 + .5,
			duration: Math.random() * 20 + 20,
			delay: Math.random() * -20,
			opacity: type === "star" ? Math.random() * .3 + .1 : Math.random() * .15 + .05
		};
	}), []);
	return /* @__PURE__ */ jsxs("div", {
		className: cn("relative w-full overflow-hidden bg-bg-dark", !flow && "min-h-screen", className),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none z-0",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-bg-rose-dark blur-[120px] animate-gradient-drift-1 will-change-transform" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-rose-900/10 blur-[150px] animate-gradient-drift-2 will-change-transform" })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 pointer-events-none z-[1]",
				children: particles.map((p) => /* @__PURE__ */ jsx("div", {
					className: cn("absolute rounded-full animate-float-particle pointer-events-none", p.type === "star" ? "bg-white" : "bg-rose-200/30"),
					style: {
						left: `${p.x}%`,
						top: `${p.y}%`,
						width: p.size,
						height: p.size,
						opacity: p.opacity,
						animationDuration: `${p.duration}s`,
						animationDelay: `${p.delay}s`
					}
				}, p.id))
			}),
			/* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-noise z-[2] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,4,6,0.8)_100%)] z-[2]" }),
			/* @__PURE__ */ jsx("div", {
				className: cn("relative z-10 w-full", !flow && "h-full flex flex-col items-center justify-center min-h-screen"),
				children
			})
		]
	});
}
//#endregion
//#region app/components/splash/DateInput.tsx
function DateInput({ onSuccess, isUnlocked }) {
	const [day, setDay] = useState("");
	const [month, setMonth] = useState("");
	const [year, setYear] = useState("");
	const [isError, setIsError] = useState(false);
	const dayRef = useRef(null);
	const monthRef = useRef(null);
	const yearRef = useRef(null);
	const checkDate = (d, m, y) => {
		if (d === "10" && (m === "05" || m === "5") && y === "2008") onSuccess();
		else if (d.length === 2 && m.length >= 1 && y.length === 4) {
			setIsError(true);
			setTimeout(() => setIsError(false), 800);
			setDay("");
			setMonth("");
			setYear("");
			dayRef.current?.focus();
		}
	};
	const handleDayChange = (e) => {
		if (isUnlocked) return;
		const val = e.target.value.replace(/\D/g, "").slice(0, 2);
		setDay(val);
		setIsError(false);
		if (val.length === 2) monthRef.current?.focus();
		checkDate(val, month, year);
	};
	const handleMonthChange = (e) => {
		if (isUnlocked) return;
		const val = e.target.value.replace(/\D/g, "").slice(0, 2);
		setMonth(val);
		setIsError(false);
		if (val.length === 2) yearRef.current?.focus();
		else if (val.length === 0) {}
		checkDate(day, val, year);
	};
	const handleYearChange = (e) => {
		if (isUnlocked) return;
		const val = e.target.value.replace(/\D/g, "").slice(0, 4);
		setYear(val);
		setIsError(false);
		checkDate(day, month, val);
	};
	const handleKeyDown = (e, refToFocus) => {
		if (isUnlocked) return;
		if (e.key === "Backspace" && e.currentTarget.value === "") refToFocus.current?.focus();
	};
	return /* @__PURE__ */ jsxs(motion.div, {
		animate: isError ? { x: [
			-10,
			10,
			-10,
			10,
			-5,
			5,
			0
		] } : {},
		transition: { duration: .4 },
		className: cn("flex items-center gap-3 md:gap-4 justify-center mt-6 transition-colors duration-500", isError && "drop-shadow-[0_0_15px_rgba(255,0,0,0.4)]"),
		children: [
			/* @__PURE__ */ jsx("input", {
				ref: dayRef,
				type: "text",
				inputMode: "numeric",
				placeholder: "DD",
				value: day,
				onChange: handleDayChange,
				onKeyDown: (e) => handleKeyDown(e, null),
				disabled: isUnlocked,
				className: cn("w-14 h-16 md:w-16 md:h-20 text-center text-xl md:text-2xl font-playfair rounded-2xl", "bg-white/5 border border-white/10 backdrop-blur-md shadow-inner", "text-text-light placeholder:text-white/20 transition-[transform,opacity,border-color,box-shadow] duration-300", "focus:bg-white/10 focus:border-rose-300/50 focus:ring-1 focus:ring-rose-300/50", isError ? "border-red-500/50 bg-red-500/10 text-red-200" : "", isUnlocked && "opacity-0 pointer-events-none scale-90")
			}),
			/* @__PURE__ */ jsx("span", {
				className: cn("text-2xl font-light text-rose-300/50", isUnlocked && "opacity-0"),
				children: "/"
			}),
			/* @__PURE__ */ jsx("input", {
				ref: monthRef,
				type: "text",
				inputMode: "numeric",
				placeholder: "MM",
				value: month,
				onChange: handleMonthChange,
				onKeyDown: (e) => handleKeyDown(e, dayRef),
				disabled: isUnlocked,
				className: cn("w-14 h-16 md:w-16 md:h-20 text-center text-xl md:text-2xl font-playfair rounded-2xl", "bg-white/5 border border-white/10 backdrop-blur-md shadow-inner", "text-text-light placeholder:text-white/20 transition-[transform,opacity,border-color,box-shadow] duration-300", "focus:bg-white/10 focus:border-rose-300/50 focus:ring-1 focus:ring-rose-300/50", isError ? "border-red-500/50 bg-red-500/10 text-red-200" : "", isUnlocked && "opacity-0 pointer-events-none scale-90")
			}),
			/* @__PURE__ */ jsx("span", {
				className: cn("text-2xl font-light text-rose-300/50", isUnlocked && "opacity-0"),
				children: "/"
			}),
			/* @__PURE__ */ jsx("input", {
				ref: yearRef,
				type: "text",
				inputMode: "numeric",
				placeholder: "YYYY",
				value: year,
				onChange: handleYearChange,
				onKeyDown: (e) => handleKeyDown(e, monthRef),
				disabled: isUnlocked,
				className: cn("w-20 h-16 md:w-24 md:h-20 text-center text-xl md:text-2xl font-playfair rounded-2xl", "bg-white/5 border border-white/10 backdrop-blur-md shadow-inner", "text-text-light placeholder:text-white/20 transition-[transform,opacity,border-color,box-shadow] duration-300", "focus:bg-white/10 focus:border-rose-300/50 focus:ring-1 focus:ring-rose-300/50", isError ? "border-red-500/50 bg-red-500/10 text-red-200" : "", isUnlocked && "opacity-0 pointer-events-none scale-90")
			})
		]
	});
}
//#endregion
//#region app/components/splash/Lock.tsx
function Lock$1({ isUnlocked, onSuccess }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		className: cn("relative w-full max-w-sm mx-auto flex flex-col items-center mt-12 transition-[transform,opacity] duration-700", isUnlocked ? "scale-110" : ""),
		children: [/* @__PURE__ */ jsxs(motion.div, {
			animate: { y: isUnlocked ? -20 : [
				0,
				-5,
				0
			] },
			transition: { y: isUnlocked ? {
				duration: .5,
				ease: "easeOut"
			} : {
				duration: 4,
				repeat: Infinity,
				ease: "easeInOut"
			} },
			className: cn("relative flex items-center justify-center rounded-3xl", "w-32 h-32 md:w-40 md:h-40", "bg-gradient-to-br from-white/10 to-transparent", "border border-white/20 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]", "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-rose-300/20 before:to-transparent before:opacity-50", "after:absolute after:inset-0 after:rounded-3xl after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"),
			children: [/* @__PURE__ */ jsx(motion.div, {
				className: "absolute inset-0 rounded-3xl bg-rose-500/20 blur-xl z-0",
				animate: {
					opacity: isUnlocked ? .8 : [
						.3,
						.6,
						.3
					],
					scale: isUnlocked ? 1.5 : [
						1,
						1.1,
						1
					]
				},
				transition: {
					duration: 3,
					repeat: isUnlocked ? 0 : Infinity
				}
			}), /* @__PURE__ */ jsx("div", {
				className: "relative z-10 text-rose-100 drop-shadow-[0_2px_10px_rgba(245,198,208,0.5)]",
				children: /* @__PURE__ */ jsx(AnimatePresence, {
					mode: "wait",
					children: !isUnlocked ? /* @__PURE__ */ jsx(motion.div, {
						initial: {
							opacity: 0,
							scale: .8
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						exit: {
							opacity: 0,
							scale: .8,
							y: -20
						},
						transition: { duration: .3 },
						children: /* @__PURE__ */ jsx(Lock, {
							size: 64,
							strokeWidth: 1.5,
							className: "md:w-20 md:h-20"
						})
					}, "locked") : /* @__PURE__ */ jsx(motion.div, {
						initial: {
							opacity: 0,
							scale: .8,
							y: 20
						},
						animate: {
							opacity: 1,
							scale: 1,
							y: 0
						},
						transition: {
							type: "spring",
							bounce: .5
						},
						children: /* @__PURE__ */ jsx(Unlock, {
							size: 64,
							strokeWidth: 1.5,
							className: "md:w-20 md:h-20 text-rose-300"
						})
					}, "unlocked")
				})
			})]
		}), /* @__PURE__ */ jsxs(motion.div, {
			animate: {
				opacity: isUnlocked ? 0 : 1,
				y: isUnlocked ? 20 : 0
			},
			transition: { duration: .5 },
			children: [/* @__PURE__ */ jsx("p", {
				className: "mt-8 text-rose-200/60 font-playfair tracking-widest text-sm md:text-base uppercase",
				children: "Enter Date to Unlock"
			}), /* @__PURE__ */ jsx(DateInput, {
				onSuccess,
				isUnlocked
			})]
		})]
	});
}
//#endregion
//#region app/components/splash/SplashScreen.tsx
function SplashScreen({ onComplete }) {
	const [isUnlocked, setIsUnlocked] = useState(false);
	const [isFadingOut, setIsFadingOut] = useState(false);
	const handleSuccess = () => {
		setIsUnlocked(true);
		const end = Date.now() + 2e3;
		const frame = () => {
			confetti({
				particleCount: 3,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: [
					"#f5c6d0",
					"#e8a0b0",
					"#d47088",
					"#ffffff"
				]
			});
			confetti({
				particleCount: 3,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: [
					"#f5c6d0",
					"#e8a0b0",
					"#d47088",
					"#ffffff"
				]
			});
			if (Date.now() < end) requestAnimationFrame(frame);
		};
		frame();
		setTimeout(() => {
			setIsFadingOut(true);
			setTimeout(() => {
				onComplete();
			}, 800);
		}, 2e3);
	};
	if (isFadingOut) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 transition-opacity duration-1000",
		style: { opacity: isFadingOut ? 0 : 1 },
		children: /* @__PURE__ */ jsx(Background, { children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-4xl px-4 flex flex-col items-center justify-center",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "text-center mb-16 md:mb-24 splash-title-appear",
					children: /* @__PURE__ */ jsxs("h1", {
						className: "font-cormorant text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.2em] md:tracking-[0.3em] text-rose-50 hero-glow-pulse drop-shadow-[0_0_30px_rgba(245,198,208,0.3)]",
						children: [/* @__PURE__ */ jsx("span", {
							className: "block mb-2 text-rose-100/80 font-light text-2xl md:text-3xl tracking-[0.4em]",
							children: "HAPPY BIRTHDAY"
						}), "RAHMA"]
					})
				}),
				/* @__PURE__ */ jsx(Lock$1, {
					isUnlocked,
					onSuccess: handleSuccess
				}),
				isUnlocked && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 pointer-events-none mix-blend-overlay z-50 splash-flash" })
			]
		}) })
	});
}
//#endregion
//#region app/components/home/InteractiveScene.tsx
/**
* InteractiveScene — Premium cinematic hero section.
*
* PERFORMANCE OPTIMIZATIONS:
* - ZERO Framer Motion = zero JS per frame for ambient effects
* - All particles use CSS @keyframes (GPU-composited, no JS)
* - Removed useScroll/useTransform parallax (heavy on mobile)
* - Replaced motion.div animated blurs with static CSS
* - Glow pulses via CSS @keyframes instead of Framer animate
* - All transforms use will-change and translateZ(0) for GPU layers
* - Reduced particle count from 40 to 20 (halved DOM nodes)
*/
function InteractiveScene() {
	const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 3 + 1,
		duration: Math.random() * 20 + 15,
		delay: Math.random() * -15
	})), []);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 pointer-events-none z-0",
				children: /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(138,32,64,0.12)_0%,transparent_60%)] hero-bloom will-change-transform" })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 pointer-events-none z-0",
				children: particles.map((p) => /* @__PURE__ */ jsx("div", {
					className: "absolute rounded-full bg-rose-200/20 animate-float-particle",
					style: {
						left: `${p.x}%`,
						top: `${p.y}%`,
						width: p.size,
						height: p.size,
						animationDuration: `${p.duration}s`,
						animationDelay: `${p.delay}s`
					}
				}, p.id))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full border border-rose-300/8 hero-ring-appear" }), /* @__PURE__ */ jsx("div", { className: "absolute w-[320px] h-[320px] md:w-[480px] md:h-[480px] rounded-full border-[0.5px] border-dashed border-rose-400/15 hero-orbit will-change-transform" })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-20 flex flex-col items-center justify-center w-full px-6 mt-16 md:mt-24 pointer-events-none",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative flex flex-col items-center text-center hero-title-appear",
						children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[150%] bg-[radial-gradient(ellipse,rgba(196,90,112,0.1)_0%,transparent_70%)] rounded-full hero-glow-pulse" }), /* @__PURE__ */ jsxs("h1", {
							className: "font-cormorant italic font-light flex flex-col items-center gap-3 md:gap-5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] text-rose-100/90 drop-shadow-[0_0_15px_rgba(245,198,208,0.3)] hero-text-reveal",
								style: { animationDelay: "0.3s" },
								children: "Happy Birthday"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-vibes text-7xl md:text-[8rem] lg:text-[10rem] text-rose-50 tracking-wide relative mt-2 md:mt-4 hero-text-reveal",
								style: { animationDelay: "0.8s" },
								children: /* @__PURE__ */ jsx("span", {
									className: "relative z-10 drop-shadow-[0_0_30px_rgba(245,198,208,0.5)]",
									children: "Rahma"
								})
							})]
						})]
					}),
					/* @__PURE__ */ jsx("div", { className: "w-28 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-rose-300/50 to-transparent my-10 md:my-14 hero-divider-reveal" }),
					/* @__PURE__ */ jsx("div", {
						className: "relative text-center max-w-2xl px-4 hero-text-reveal",
						style: { animationDelay: "1.6s" },
						children: /* @__PURE__ */ jsx("p", {
							dir: "rtl",
							className: "font-ruqaa text-3xl md:text-4xl lg:text-5xl text-rose-200/90 leading-relaxed drop-shadow-[0_0_15px_rgba(245,198,208,0.2)]",
							children: "كل سنة وانتي أجمل حكاية في حياتي"
						})
					})
				]
			})
		]
	});
}
//#endregion
//#region app/components/home/CinematicVideo.tsx
/**
* CinematicVideo — Premium locked scroll-hijacking video experience.
*
* PERFORMANCE OPTIMIZATIONS v2:
* - rAF loop ONLY runs when section is locked (not continuously)
* - Zero React state updates per frame — all UI via direct DOM refs
* - Video seeks throttled with adaptive threshold
* - Particles use CSS @keyframes, zero JS overhead
* - All transitions use transform/opacity only (GPU-composited)
* - Passive listeners where possible, non-passive only for preventDefault
* - Cleanup on unmount restores body scroll
* - ADDED: Adaptive mobile detection — reduces lerp smoothing on mobile for responsiveness
* - ADDED: Higher seek threshold to reduce decoder thrash
* - ADDED: Video preload="metadata" instead of "auto" to reduce initial bandwidth
* - REMOVED: backdrop-blur on nav buttons (expensive composite layer)
*/
function lerp(a, b, t) {
	return a + (b - a) * t;
}
var isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
function CinematicVideo({ children, onNavigateUp, onNavigateDown }) {
	const sectionRef = useRef(null);
	const videoRef = useRef(null);
	const progressRef = useRef(0);
	const targetProgressRef = useRef(0);
	const currentTimeRef = useRef(0);
	const isLockedRef = useRef(false);
	const isCompleteRef = useRef(false);
	const rafRef = useRef(0);
	const touchYRef = useRef(0);
	const isReadyRef = useRef(false);
	const isTickingRef = useRef(false);
	const titleRef = useRef(null);
	const progressBarRef = useRef(null);
	const navDownRef = useRef(null);
	const overlayRef = useRef(null);
	const SCROLL_SENSITIVITY = 6e-4;
	const TOUCH_SENSITIVITY = 8e-4;
	const MAX_DELTA_PER_EVENT = .015;
	const PROGRESS_LERP = isMobile ? .18 : .12;
	const VIDEO_LERP = isMobile ? .08 : .04;
	const SEEK_THRESHOLD = isMobile ? .08 : .03;
	const lockScroll = useCallback(() => {
		if (isLockedRef.current) return;
		isLockedRef.current = true;
		document.body.style.overflow = "hidden";
		document.body.style.touchAction = "none";
		if (!isTickingRef.current) {
			isTickingRef.current = true;
			rafRef.current = requestAnimationFrame(tick);
		}
	}, []);
	const unlockScroll = useCallback(() => {
		if (!isLockedRef.current) return;
		isLockedRef.current = false;
		document.body.style.overflow = "";
		document.body.style.touchAction = "";
		isTickingRef.current = false;
		cancelAnimationFrame(rafRef.current);
	}, []);
	const goUp = useCallback(() => {
		unlockScroll();
		targetProgressRef.current = 0;
		progressRef.current = 0;
		if (onNavigateUp) onNavigateUp();
		else {
			const section = sectionRef.current;
			if (section) {
				const prev = section.previousElementSibling;
				if (prev) prev.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
			}
		}
	}, [unlockScroll, onNavigateUp]);
	const goDown = useCallback(() => {
		unlockScroll();
		if (onNavigateDown) onNavigateDown();
		else {
			const section = sectionRef.current;
			if (section) {
				const next = section.nextElementSibling;
				if (next) next.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			}
		}
	}, [unlockScroll, onNavigateDown]);
	const tick = useCallback(() => {
		if (!isTickingRef.current) return;
		const video = videoRef.current;
		if (!video || !video.duration || !isReadyRef.current) {
			rafRef.current = requestAnimationFrame(tick);
			return;
		}
		progressRef.current = lerp(progressRef.current, targetProgressRef.current, PROGRESS_LERP);
		if (Math.abs(progressRef.current - targetProgressRef.current) < 5e-4) progressRef.current = targetProgressRef.current;
		const targetTime = progressRef.current * video.duration;
		currentTimeRef.current = lerp(currentTimeRef.current, targetTime, VIDEO_LERP);
		const clampedTime = Math.max(0, Math.min(video.duration - .05, currentTimeRef.current));
		if (Math.abs(video.currentTime - clampedTime) > SEEK_THRESHOLD) video.currentTime = clampedTime;
		if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${progressRef.current})`;
		if (titleRef.current) {
			const titleOpacity = Math.max(0, 1 - progressRef.current * 5);
			titleRef.current.style.opacity = String(titleOpacity);
		}
		const complete = progressRef.current >= .99;
		if (complete !== isCompleteRef.current) {
			isCompleteRef.current = complete;
			if (navDownRef.current) {
				navDownRef.current.style.opacity = complete ? "1" : "0";
				navDownRef.current.style.pointerEvents = complete ? "auto" : "none";
			}
			if (overlayRef.current) {
				overlayRef.current.style.opacity = complete ? "1" : "0";
				overlayRef.current.style.pointerEvents = complete ? "auto" : "none";
			}
		}
		rafRef.current = requestAnimationFrame(tick);
	}, []);
	const normalizeDelta = useCallback((deltaY, deltaMode) => {
		let normalized = deltaY;
		if (deltaMode === 1) normalized *= 40;
		if (deltaMode === 2) normalized *= 800;
		return Math.sign(normalized) * Math.min(Math.abs(normalized), 150);
	}, []);
	const handleWheel = useCallback((e) => {
		if (!isLockedRef.current || !isReadyRef.current) return;
		e.preventDefault();
		e.stopPropagation();
		const rawDelta = normalizeDelta(e.deltaY, e.deltaMode) * SCROLL_SENSITIVITY;
		const delta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), MAX_DELTA_PER_EVENT);
		const newTarget = targetProgressRef.current + delta;
		if (newTarget < -.03) {
			targetProgressRef.current = 0;
			progressRef.current = 0;
			goUp();
			return;
		}
		if (newTarget > 1.05 && isCompleteRef.current) {
			goDown();
			return;
		}
		targetProgressRef.current = Math.max(0, Math.min(1, newTarget));
	}, [
		goUp,
		goDown,
		normalizeDelta
	]);
	const handleTouchStart = useCallback((e) => {
		if (!isLockedRef.current) return;
		touchYRef.current = e.touches[0].clientY;
	}, []);
	const handleTouchMove = useCallback((e) => {
		if (!isLockedRef.current || !isReadyRef.current) return;
		e.preventDefault();
		const currentY = e.touches[0].clientY;
		const rawDelta = (touchYRef.current - currentY) * TOUCH_SENSITIVITY;
		touchYRef.current = currentY;
		const delta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), MAX_DELTA_PER_EVENT);
		const newTarget = targetProgressRef.current + delta;
		if (newTarget < -.03) {
			targetProgressRef.current = 0;
			progressRef.current = 0;
			goUp();
			return;
		}
		if (newTarget > 1.05 && isCompleteRef.current) {
			goDown();
			return;
		}
		targetProgressRef.current = Math.max(0, Math.min(1, newTarget));
	}, [goUp, goDown]);
	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) if (entry.isIntersecting && entry.intersectionRatio > .5) {
				lockScroll();
				section.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			}
		}, { threshold: [.5] });
		observer.observe(section);
		return () => observer.disconnect();
	}, [lockScroll]);
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		const onLoadedMetadata = () => {
			video.pause();
			video.currentTime = 0;
			isReadyRef.current = true;
		};
		if (video.readyState >= 1) onLoadedMetadata();
		else video.addEventListener("loadedmetadata", onLoadedMetadata);
		window.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("touchstart", handleTouchStart, { passive: true });
		window.addEventListener("touchmove", handleTouchMove, { passive: false });
		return () => {
			video.removeEventListener("loadedmetadata", onLoadedMetadata);
			window.removeEventListener("wheel", handleWheel);
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchmove", handleTouchMove);
			cancelAnimationFrame(rafRef.current);
			isTickingRef.current = false;
			document.body.style.overflow = "";
			document.body.style.touchAction = "";
		};
	}, [
		handleWheel,
		handleTouchStart,
		handleTouchMove
	]);
	const particles = useMemo(() => Array.from({ length: 5 }).map((_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 3 + 1,
		duration: Math.random() * 12 + 8,
		delay: Math.random() * 4
	})), []);
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		id: "cinematic-video",
		className: "relative w-full h-screen overflow-hidden bg-bg-dark",
		children: [
			/* @__PURE__ */ jsx("video", {
				ref: videoRef,
				src: "/hero/vid.mp4",
				muted: true,
				playsInline: true,
				preload: "metadata",
				disablePictureInPicture: true,
				className: "absolute inset-0 w-full h-full object-cover",
				style: { transform: "translateZ(0)" }
			}),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,4,6,0.75)_100%)] z-10" }),
			/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bg-dark/80 to-transparent pointer-events-none z-10" }),
			/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-dark/80 to-transparent pointer-events-none z-10" }),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none mix-blend-multiply bg-gradient-to-br from-transparent via-rose-900/8 to-transparent z-10" }),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-noise z-10" }),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 pointer-events-none z-20",
				children: particles.map((p) => /* @__PURE__ */ jsx("div", {
					className: "absolute rounded-full bg-rose-200/25 animate-float-particle",
					style: {
						left: `${p.x}%`,
						top: `${p.y}%`,
						width: p.size,
						height: p.size,
						animationDuration: `${p.duration}s`,
						animationDelay: `${p.delay}s`
					}
				}, p.id))
			}),
			/* @__PURE__ */ jsx("h2", {
				ref: titleRef,
				className: cn("absolute top-12 md:top-16 left-0 right-0 text-center px-4 z-30", "font-cormorant italic text-2xl md:text-4xl font-light tracking-[0.15em] text-rose-50/80", "drop-shadow-[0_0_20px_rgba(245,198,208,0.2)]"),
				children: "A journey through our memories…"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30",
				children: /* @__PURE__ */ jsx("div", {
					ref: progressBarRef,
					className: "h-full bg-gradient-to-r from-rose-300/60 to-rose-500/60 origin-left will-change-transform",
					style: { transform: "scaleX(0)" }
				})
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: goUp,
				className: cn("absolute top-6 left-1/2 -translate-x-1/2 z-40", "w-10 h-10 rounded-full flex items-center justify-center text-rose-100/70", "bg-black/40 border border-white/10", "shadow-[0_4px_15px_rgba(0,0,0,0.3)]", "hover:bg-black/60 hover:text-rose-50", "transition-[transform,opacity] duration-500 cursor-pointer", "opacity-70 hover:opacity-100 hover:scale-105"),
				children: /* @__PURE__ */ jsx(ChevronUp, {
					size: 24,
					strokeWidth: 1.5
				})
			}),
			/* @__PURE__ */ jsx("button", {
				ref: navDownRef,
				onClick: goDown,
				className: cn("absolute bottom-8 left-0 right-0 mx-auto w-fit z-40", "w-12 h-12 rounded-full flex items-center justify-center text-rose-50", "bg-black/40 border border-white/15", "shadow-[0_8px_25px_rgba(245,198,208,0.15)]", "hover:bg-black/60", "transition-[transform,opacity] duration-500 cursor-pointer", "opacity-0 pointer-events-none animate-gentle-bounce", "hover:scale-105"),
				children: /* @__PURE__ */ jsx(ChevronDown, {
					size: 28,
					strokeWidth: 1.5
				})
			}),
			/* @__PURE__ */ jsx("div", {
				ref: overlayRef,
				className: "absolute inset-0 z-30 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-1000",
				children: React.Children.map(children, (child) => {
					if (React.isValidElement(child)) return React.cloneElement(child, { onExit: goUp });
					return child;
				})
			})
		]
	});
}
//#endregion
//#region app/components/home/FinalOverlay.tsx
/**
* FinalOverlay — Luxury cinematic love ending scene.
*
* Appears over the frozen last video frame with:
* - Horizontal card carousel with photos from /srcc/
* - Love message paper with Arabic calligraphy
* - Left/right navigation arrows
* - Touch swipe support
*
* PERFORMANCE:
* - Images lazy-loaded via loading="lazy"
* - Carousel uses transform: translateX (GPU-composited)
* - Card transitions use transform + opacity only
* - Paper text uses opacity-only fade transitions
*/
var SLIDES = [
	{
		image: "/srcc/pic1.jpeg",
		message: "أنتِ أجمل صدفة حصلت في حياتي\nكل لحظة معاكِ بتبقى ذكرى مبنسهاش أبداً"
	},
	{
		image: "/srcc/pic2.jpeg",
		message: "من يوم ما عرفتك وأنا حاسس إن الدنيا بقت أحلى\nعيونك هي البيت اللي دايمًا بلاقي فيه الأمان"
	},
	{
		image: "/srcc/pic3.jpeg",
		message: "كل ضحكة منك بتملا الدنيا نور\nوكل يوم بيعدي معاكِ بيبقى أحلى من اللي قبله"
	},
	{
		image: "/srcc/pic4.jpeg",
		message: "لو الحب كان شخص… كان هيكون إنتِ\nبحبك بكل حاجة فيّا، وبكل حاجة فيكِ"
	},
	{
		image: "/srcc/pic5.jpeg",
		message: "إنتِ مش بس حبيبتي\nإنتِ صاحبتي، عيلتي، ومكاني الآمن في الدنيا دي"
	},
	{
		image: "/srcc/pic6.jpeg",
		message: "بحلم بيوم نفضل فيه جنب بعض للأبد\nمن غير ما حاجة تبعدنا عن بعض"
	},
	{
		image: "/srcc/pic7.jpeg",
		message: "كل صورة معاكِ بتحكي قصة\nوكل قصة فيها حب مش بيخلص"
	},
	{
		image: "/srcc/pic8.jpeg",
		message: "ربنا كرمني بيكِ\nوأنا كل يوم بشكره إنه حطك في طريقي"
	},
	{
		image: "/srcc/pic9.jpeg",
		message: "يا أحلى عيد ميلاد في الدنيا\nكل سنة وإنتِ معايا… وكل سنة وإنتِ أجمل"
	},
	{
		image: "/srcc/pic10.jpeg",
		message: "مهما الأيام تعدي\nإنتِ هتفضلي الحاجة الوحيدة اللي قلبي مش هيتخلى عنها"
	},
	{
		image: "/srcc/pic12.jpeg",
		message: "كل سنة وأنتِ نور عينيّا\nعيد ميلاد سعيد يا أغلى إنسانة في حياتي ❤️"
	}
];
function FinalOverlay({ onExit }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const touchStartX = useRef(0);
	const containerRef = useRef(null);
	const total = SLIDES.length;
	const goNext = useCallback(() => {
		if (isTransitioning) return;
		setIsTransitioning(true);
		setActiveIndex((prev) => (prev + 1) % total);
		setTimeout(() => setIsTransitioning(false), 500);
	}, [isTransitioning, total]);
	const goPrev = useCallback(() => {
		if (isTransitioning) return;
		setIsTransitioning(true);
		setActiveIndex((prev) => (prev - 1 + total) % total);
		setTimeout(() => setIsTransitioning(false), 500);
	}, [isTransitioning, total]);
	const handleTouchStart = useCallback((e) => {
		touchStartX.current = e.touches[0].clientX;
	}, []);
	const handleTouchEnd = useCallback((e) => {
		const delta = touchStartX.current - e.changedTouches[0].clientX;
		if (Math.abs(delta) > 50) if (delta > 0) goNext();
		else goPrev();
	}, [goNext, goPrev]);
	useEffect(() => {
		const handleKey = (e) => {
			if (e.key === "ArrowRight") goNext();
			if (e.key === "ArrowLeft") goPrev();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [goNext, goPrev]);
	const currentSlide = SLIDES[activeIndex];
	return /* @__PURE__ */ jsxs("div", {
		ref: containerRef,
		className: "absolute inset-0 z-40 flex flex-col items-center justify-center",
		onTouchStart: handleTouchStart,
		onTouchEnd: handleTouchEnd,
		children: [
			/* @__PURE__ */ jsx("button", {
				onClick: onExit,
				className: cn("absolute top-6 right-6 z-50", "w-10 h-10 rounded-full flex items-center justify-center", "bg-black/50 border border-white/20", "text-rose-100 hover:text-white hover:bg-black/70", "transition-all duration-300 cursor-pointer shadow-lg", "hover:scale-110 active:scale-95"),
				children: /* @__PURE__ */ jsx(X, {
					size: 20,
					strokeWidth: 2.5
				})
			}),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-bg-dark/70 via-bg-rose-dark/60 to-bg-dark/80 pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(8,4,6,0.6)_100%)]" }),
			/* @__PURE__ */ jsx("button", {
				onClick: goPrev,
				className: cn("absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-50", "w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center", "bg-black/40 border border-white/10", "text-rose-100/70 hover:text-rose-50", "hover:bg-black/60", "transition-[transform,opacity] duration-500 cursor-pointer", "hover:scale-110 active:scale-95"),
				children: /* @__PURE__ */ jsx(ChevronLeft, {
					size: 24,
					strokeWidth: 1.5
				})
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: goNext,
				className: cn("absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-50", "w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center", "bg-black/40 border border-white/10", "text-rose-100/70 hover:text-rose-50", "hover:bg-black/60", "transition-[transform,opacity] duration-500 cursor-pointer", "hover:scale-110 active:scale-95"),
				children: /* @__PURE__ */ jsx(ChevronRight, {
					size: 24,
					strokeWidth: 1.5
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full max-w-4xl px-16 md:px-20 flex items-center justify-center mb-6 md:mb-8",
				children: [/* @__PURE__ */ jsx("div", {
					className: "relative w-full flex items-center justify-center",
					style: { perspective: "1000px" },
					children: SLIDES.map((slide, i) => {
						const offset = i - activeIndex;
						const wrappedOffset = offset > total / 2 ? offset - total : offset < -total / 2 ? offset + total : offset;
						const isActive = wrappedOffset === 0;
						if (!(Math.abs(wrappedOffset) <= 2)) return null;
						return /* @__PURE__ */ jsx("div", {
							className: "absolute transition-all duration-500 ease-out",
							style: {
								left: "50%",
								transform: `
                    translateX(calc(-50% + ${wrappedOffset * 220}px))
                    translateZ(${isActive ? 0 : -100}px)
                    rotateY(${wrappedOffset * -8}deg)
                    scale(${isActive ? 1 : .75})
                  `,
								opacity: isActive ? 1 : Math.max(0, .5 - Math.abs(wrappedOffset) * .15),
								zIndex: isActive ? 20 : 10 - Math.abs(wrappedOffset),
								pointerEvents: isActive ? "auto" : "none"
							},
							children: /* @__PURE__ */ jsx("div", {
								className: cn("w-56 h-72 md:w-72 md:h-96 rounded-2xl overflow-hidden", "border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]", isActive && "shadow-[0_20px_60px_rgba(196,90,112,0.3),0_0_30px_rgba(245,198,208,0.15)]"),
								children: /* @__PURE__ */ jsx("img", {
									src: slide.image,
									alt: `Memory ${i + 1}`,
									loading: "lazy",
									className: "w-full h-full object-cover",
									draggable: false
								})
							})
						}, i);
					})
				}), /* @__PURE__ */ jsx("div", { className: "w-56 h-72 md:w-72 md:h-96 pointer-events-none opacity-0" })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "relative z-10 flex items-center gap-2 mb-5 md:mb-6",
				children: SLIDES.map((_, i) => /* @__PURE__ */ jsx("button", {
					onClick: () => {
						if (!isTransitioning) {
							setIsTransitioning(true);
							setActiveIndex(i);
							setTimeout(() => setIsTransitioning(false), 500);
						}
					},
					className: cn("rounded-full transition-all duration-400 cursor-pointer", i === activeIndex ? "w-6 h-2 bg-rose-300/80" : "w-2 h-2 bg-white/20 hover:bg-white/40")
				}, i))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "relative z-10 w-[85%] max-w-sm mx-auto",
				children: /* @__PURE__ */ jsxs("div", {
					className: cn("relative px-6 pt-10 pb-5 md:px-8 md:pt-12 md:pb-6 rounded-lg", "bg-[#f4efea]", "border border-[#e0d6c8]", "shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(0,0,0,0.02)]", "transform rotate-[0.5deg]"),
					style: {
						backgroundImage: `
              linear-gradient(135deg, rgba(244,239,234,0.95) 0%, rgba(235,228,218,0.9) 100%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")
            `,
						backgroundBlendMode: "multiply"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute -top-5 left-1/2 -translate-x-1/2 z-20 text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]",
							children: "🎀"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-rose-300 rounded-tl" }),
						/* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-rose-300 rounded-tr" }),
						/* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-rose-300 rounded-bl" }),
						/* @__PURE__ */ jsx("div", { className: "absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-rose-300 rounded-br" }),
						/* @__PURE__ */ jsx("div", {
							className: "text-center animate-fade-in",
							dir: "rtl",
							children: currentSlide.message.split("\n").map((line, idx) => /* @__PURE__ */ jsx("p", {
								className: cn("font-ruqaa text-lg md:text-xl font-bold leading-relaxed", "text-[#2a1f1d]", idx > 0 && "mt-2"),
								children: line
							}, idx))
						}, activeIndex),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 mb-1 flex justify-between items-end",
							dir: "rtl",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-ruqaa text-[#2a1f1d] font-bold text-lg md:text-xl drop-shadow-sm",
								children: "مرسلة من زياد ❤️"
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-rose-400 font-playfair text-xs md:text-sm tracking-[0.2em] font-semibold opacity-80",
								children: [
									activeIndex + 1,
									" / ",
									total
								]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region app/components/home/CinematicLetter.tsx
/**
* CinematicLetter — Scroll-reveal love letter.
* 
* UPDATED: Word-by-word reveal with "fly-away" effect.
* Uses a single useScroll hook per line for performance.
*/
var MESSAGE_LINES = [
	"كل سنة وانتي أجمل حاجة حصلتلي.",
	"كل سنه ونحنا سوي مكملين ",
	"ومهما حصصل بنا من مشاكل و خلففات معزتك في قلبي زي مم هي بحبك ",
	"بحب تفاصيلك الصغيرة قبل الكبيرة.",
	"وسط كل الناس… قلبي اختارك انتي.",
	"معاكي حتى السكوت بيكون جميل.",
	"كل تفصيله هنا معموله  بحب و معموله ليكي",
	"وأيًا كان اللي هيحصل بعدين… انا هتجوزك ",
	"إنتي راحتي، وضحكتي، والحاجة الحلوة اللي بتحصل فجأة.",
	"ولو كان عندي أمنية واحدة تتكرر… هختارك انتي كل مرة.",
	"ربنا يخليكي ليا و ميحرمنيش منك ابدء ",
	"بحبك"
];
function Word({ word, progress, range }) {
	const opacity = useTransform(progress, range, [0, 1]);
	const y = useTransform(progress, range, [20, 0]);
	const scale = useTransform(progress, range, [.8, 1]);
	return /* @__PURE__ */ jsx(motion.span, {
		style: {
			opacity,
			y,
			scale,
			display: "inline-block"
		},
		className: "mx-1.5 md:mx-2 lg:mx-3",
		children: word
	});
}
function MessageLine({ line }) {
	const ref = useRef(null);
	const words = line.split(" ");
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 90%", "center 35%"]
	});
	return /* @__PURE__ */ jsx("div", {
		ref,
		className: "w-full my-40 md:my-56 lg:my-64 text-center font-ruqaa text-4xl md:text-5xl lg:text-6xl leading-[2] md:leading-[2.5] text-rose-50 flex flex-wrap justify-center",
		dir: "rtl",
		children: words.map((word, i) => {
			const start = i / words.length;
			const end = start + 1 / words.length * 1.5;
			return /* @__PURE__ */ jsx(Word, {
				word,
				progress: scrollYProgress,
				range: [Math.min(start, .9), Math.min(end, 1)]
			}, i);
		})
	});
}
function CinematicLetter() {
	const titleRef = useRef(null);
	const { scrollYProgress: titleProgress } = useScroll({
		target: titleRef,
		offset: ["start 85%", "end 20%"]
	});
	const titleOpacity = useTransform(titleProgress, [
		0,
		.3,
		.7,
		1
	], [
		0,
		1,
		1,
		0
	]);
	const titleY = useTransform(titleProgress, [
		0,
		.3,
		.7,
		1
	], [
		30,
		0,
		0,
		-30
	]);
	return /* @__PURE__ */ jsx("section", {
		className: "relative w-full z-10 pt-32 pb-64 overflow-hidden",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-5xl mx-auto px-4 md:px-8",
			children: [/* @__PURE__ */ jsx(motion.div, {
				ref: titleRef,
				className: "w-full text-center mb-64",
				style: {
					opacity: titleOpacity,
					y: titleY
				},
				children: /* @__PURE__ */ jsx("h2", {
					className: "font-cormorant italic text-4xl md:text-5xl lg:text-6xl text-rose-200/80 tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_20px_rgba(245,198,208,0.3)] font-light",
					children: "A few words for you..."
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-col items-center justify-center w-full",
				children: MESSAGE_LINES.map((line, i) => /* @__PURE__ */ jsx(MessageLine, { line }, i))
			})]
		})
	});
}
//#endregion
//#region app/components/home/RelationshipTimer.tsx
function RelationshipTimer() {
	const startDate = useMemo(() => /* @__PURE__ */ new Date("2023-04-24T00:00:00"), []);
	const [timeLeft, setTimeLeft] = useState({
		years: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	});
	useEffect(() => {
		const calculateTime = () => {
			const difference = (/* @__PURE__ */ new Date()).getTime() - startDate.getTime();
			if (difference > 0) {
				const seconds = Math.floor(difference / 1e3 % 60);
				const minutes = Math.floor(difference / 1e3 / 60 % 60);
				const hours = Math.floor(difference / (1e3 * 60 * 60) % 24);
				const daysTotal = Math.floor(difference / (1e3 * 60 * 60 * 24));
				setTimeLeft({
					years: Math.floor(daysTotal / 365),
					days: daysTotal % 365,
					hours,
					minutes,
					seconds
				});
			}
		};
		calculateTime();
		const timer = setInterval(calculateTime, 1e3);
		return () => clearInterval(timer);
	}, [startDate]);
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: -20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: 1.2,
			ease: "easeOut"
		},
		className: "absolute top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative flex items-center gap-4 md:gap-8 px-6 py-3 rounded-full bg-[#1a0810]/30 backdrop-blur-md border border-rose-900/20 shadow-[0_0_20px_rgba(244,198,208,0.05)]",
			children: [
				/* @__PURE__ */ jsx(TimeUnit, {
					value: timeLeft.years,
					label: "Years"
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsx(TimeUnit, {
					value: timeLeft.days,
					label: "Days"
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsx(TimeUnit, {
					value: timeLeft.hours,
					label: "Hours"
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsx(TimeUnit, {
					value: timeLeft.minutes,
					label: "Mins"
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsx(TimeUnit, {
					value: timeLeft.seconds,
					label: "Secs"
				})
			]
		}), /* @__PURE__ */ jsx(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: .6 },
			transition: {
				delay: .8,
				duration: 1.5
			},
			className: "mt-3 font-cormorant italic text-xs md:text-sm tracking-[0.2em] text-rose-200/80 drop-shadow-[0_0_8px_rgba(245,198,208,0.3)]",
			children: "The time we’ve shared together"
		})]
	});
}
function TimeUnit({ value, label }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center min-w-[3rem] md:min-w-[4rem]",
		children: [/* @__PURE__ */ jsx("div", {
			className: "relative h-6 md:h-8 overflow-hidden",
			children: /* @__PURE__ */ jsx(AnimatePresence, {
				mode: "popLayout",
				children: /* @__PURE__ */ jsx(motion.span, {
					initial: {
						y: 20,
						opacity: 0
					},
					animate: {
						y: 0,
						opacity: 1
					},
					exit: {
						y: -20,
						opacity: 0
					},
					transition: {
						duration: .5,
						ease: "easeInOut"
					},
					className: "block font-playfair text-lg md:text-2xl text-rose-100 drop-shadow-[0_0_10px_rgba(245,198,208,0.4)]",
					children: value.toString().padStart(2, "0")
				}, value)
			})
		}), /* @__PURE__ */ jsx("span", {
			className: "font-cormorant text-[10px] md:text-xs uppercase tracking-widest text-rose-400/60 mt-1",
			children: label
		})]
	});
}
function Separator() {
	return /* @__PURE__ */ jsx("div", { className: "w-[1px] h-4 bg-rose-900/30 self-center mt-[-10px]" });
}
//#endregion
//#region app/components/home/VoiceNoteSection.tsx
/**
* VoiceNoteSection — Audio player with waveform visualization.
*
* PERFORMANCE OPTIMIZATIONS v2:
* - Removed Framer Motion entirely (was using motion.div for simple fade-in)
* - Uses IntersectionObserver for CSS-class-based reveal instead
* - Removed layout animation on progress bar (triggers layout recalculation)
* - Progress bar uses transform: scaleX (GPU-composited) instead of width %
* - Waveform bars use useMemo (generated once, never recomputed)
* - Reduced waveform bars from 40 to 30
* - Removed per-bar box-shadow (expensive on mobile)
*/
function VoiceNoteSection() {
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef(null);
	const progressBarRef = useRef(null);
	const sectionRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) setIsVisible(true);
		}, { threshold: .2 });
		observer.observe(section);
		return () => observer.disconnect();
	}, []);
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		const updateProgress = () => {
			if (audio.duration) setProgress(audio.currentTime / audio.duration);
		};
		const handleLoadedMetadata = () => setDuration(audio.duration);
		const handleEnded = () => {
			setIsPlaying(false);
			setProgress(0);
		};
		audio.addEventListener("timeupdate", updateProgress);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("ended", handleEnded);
		return () => {
			audio.removeEventListener("timeupdate", updateProgress);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("ended", handleEnded);
		};
	}, []);
	const togglePlay = useCallback(() => {
		if (audioRef.current) {
			if (isPlaying) audioRef.current.pause();
			else audioRef.current.play();
			setIsPlaying(!isPlaying);
		}
	}, [isPlaying]);
	const handleSeek = useCallback((e) => {
		if (progressBarRef.current && audioRef.current) {
			const rect = progressBarRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const percentage = Math.max(0, Math.min(1, x / rect.width));
			const newTime = percentage * duration;
			audioRef.current.currentTime = newTime;
			setProgress(percentage);
		}
	}, [duration]);
	const waveformBars = useMemo(() => Array.from({ length: 30 }).map((_, i) => {
		return Math.sin(i * .5) * 50 + Math.random() * 50 + 20;
	}), []);
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: cn("relative w-full py-32 z-20 flex flex-col items-center justify-center overflow-hidden", "transition-opacity duration-1000", isVisible ? "opacity-100" : "opacity-0"),
		children: [
			/* @__PURE__ */ jsx("audio", {
				ref: audioRef,
				src: "/voices/voice.mp3",
				preload: "metadata"
			}),
			/* @__PURE__ */ jsx("div", {
				className: cn("text-center mb-16 transition-all duration-1000 delay-200", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"),
				children: /* @__PURE__ */ jsx("h3", {
					className: "font-cormorant italic text-3xl md:text-4xl text-rose-200/60 tracking-[0.3em] font-light drop-shadow-[0_0_15px_rgba(245,198,208,0.2)]",
					children: "Listen"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn("relative w-full max-w-md mx-4 md:max-w-lg p-6 md:p-8 rounded-[2rem]", "bg-gradient-to-br from-[#1a0810]/80 to-[#080406]/90", "border border-rose-900/30", "shadow-[0_20px_60px_rgba(0,0,0,0.5)]", "flex flex-col items-center z-10", "transition-all duration-1000 delay-300", isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"),
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-[2rem] pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(212,112,136,0.08)_0%,transparent_70%)]" }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center w-full gap-4 md:gap-6 relative z-10",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: togglePlay,
						className: "flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-rose-900/40 to-[#18060e] border border-rose-800/50 flex items-center justify-center text-rose-200 shadow-[0_0_20px_rgba(245,198,208,0.15)] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer",
						children: isPlaying ? /* @__PURE__ */ jsx(Pause, { className: "w-6 h-6 md:w-7 md:h-7 fill-rose-200" }) : /* @__PURE__ */ jsx(Play, { className: "w-6 h-6 md:w-7 md:h-7 fill-rose-200 ml-1" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-grow flex flex-col gap-2",
						children: [/* @__PURE__ */ jsx("div", {
							ref: progressBarRef,
							onClick: handleSeek,
							className: "relative w-full h-10 flex items-center justify-between gap-[2px] cursor-pointer",
							children: waveformBars.map((height, i) => {
								const isActive = i / waveformBars.length <= progress;
								return /* @__PURE__ */ jsx("div", {
									className: "w-1 rounded-full transition-colors duration-200",
									style: {
										height: `${height}%`,
										backgroundColor: isActive ? "#f5c6d0" : "rgba(196, 90, 112, 0.2)"
									}
								}, i);
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "w-full h-[1px] bg-rose-900/20 relative mt-1 overflow-hidden rounded-full",
							children: /* @__PURE__ */ jsx("div", {
								className: "absolute top-0 left-0 h-full w-full bg-rose-400/50 origin-left will-change-transform",
								style: { transform: `scaleX(${progress})` }
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: cn("mt-12 text-center transition-all duration-1000 delay-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"),
				children: /* @__PURE__ */ jsx("p", {
					className: "font-ruqaa text-2xl md:text-3xl text-rose-100/90 drop-shadow-[0_0_10px_rgba(245,198,208,0.3)]",
					dir: "rtl",
					children: "\"\" كلمات الكون كلو متوفيش حبي ليكي ...\"\""
				})
			})
		]
	});
}
//#endregion
//#region app/components/home/AuthModal.tsx
function AuthModal({ isOpen, onClose, onSuccess }) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [isUnlocking, setIsUnlocking] = useState(false);
	useEffect(() => {
		if (isOpen) {
			setPassword("");
			setError(false);
			setIsUnlocking(false);
		}
	}, [isOpen]);
	const handleSubmit = (e) => {
		e.preventDefault();
		if (password.replace(/\s+/g, "").toLowerCase() === "roo") {
			setError(false);
			setIsUnlocking(true);
			localStorage.setItem("isZiadAuthenticated", "true");
			setTimeout(() => {
				onSuccess();
			}, 1500);
		} else {
			setError(true);
			setTimeout(() => setError(false), 800);
		}
	};
	return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .5 },
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-[#080406]/80 backdrop-blur-xl px-4",
		children: [/* @__PURE__ */ jsx("div", { className: cn("absolute inset-0 pointer-events-none transition-colors duration-500", error ? "bg-[radial-gradient(circle_at_center,rgba(200,50,70,0.15)_0%,transparent_60%)]" : "bg-[radial-gradient(circle_at_center,rgba(245,198,208,0.05)_0%,transparent_60%)]") }), /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				scale: .9,
				y: 20
			},
			animate: error ? {
				x: [
					-10,
					10,
					-10,
					10,
					0
				],
				scale: 1,
				y: 0
			} : {
				scale: 1,
				y: 0
			},
			exit: {
				scale: .9,
				opacity: 0,
				y: 20
			},
			transition: error ? { duration: .4 } : {
				type: "spring",
				damping: 25,
				stiffness: 200
			},
			className: cn("relative w-full max-w-sm p-8 rounded-[2.5rem] flex flex-col items-center", "bg-gradient-to-br from-[#1a0810]/90 to-[#080406]/95 backdrop-blur-2xl", "border shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors duration-500", error ? "border-red-900/50 shadow-[0_0_30px_rgba(200,50,70,0.2)]" : "border-rose-900/30 shadow-[inset_0_0_20px_rgba(245,198,208,0.05)]"),
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "absolute top-6 right-6 text-rose-200/40 hover:text-rose-200 transition-colors",
					children: /* @__PURE__ */ jsxs("svg", {
						width: "24",
						height: "24",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ jsx("path", { d: "M18 6 6 18" }), /* @__PURE__ */ jsx("path", { d: "m6 6 12 12" })]
					})
				}),
				/* @__PURE__ */ jsx(motion.div, {
					animate: { rotate: error ? [
						-10,
						10,
						-10,
						10,
						0
					] : 0 },
					transition: { duration: .4 },
					className: "w-20 h-20 mb-6 rounded-full bg-[#2a0e18]/50 flex items-center justify-center border border-rose-800/30 shadow-[0_0_30px_rgba(245,198,208,0.1)] relative",
					children: /* @__PURE__ */ jsx(AnimatePresence, {
						mode: "wait",
						children: isUnlocking ? /* @__PURE__ */ jsx(motion.div, {
							initial: {
								scale: 0,
								rotate: -90
							},
							animate: {
								scale: 1,
								rotate: 0
							},
							className: "text-rose-300",
							children: /* @__PURE__ */ jsx(Unlock, { className: "w-8 h-8" })
						}, "unlock") : /* @__PURE__ */ jsx(motion.div, {
							initial: { scale: 0 },
							animate: { scale: 1 },
							exit: { scale: 0 },
							className: cn("transition-colors duration-300", error ? "text-red-400" : "text-rose-300/80"),
							children: /* @__PURE__ */ jsx(Lock, { className: "w-8 h-8" })
						}, "lock")
					})
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "font-cormorant italic text-2xl text-rose-200/90 tracking-widest mb-2",
					children: "Private Access"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "font-cormorant text-sm text-rose-300/50 mb-8 uppercase tracking-[0.2em]",
					children: "Enter the secret word"
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "w-full flex flex-col items-center gap-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "relative w-full max-w-[240px]",
						children: /* @__PURE__ */ jsx("input", {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "Enter the secret word",
							className: cn("w-full bg-transparent border-b-2 py-3 text-center text-xl md:text-2xl font-playfair tracking-widest text-rose-100 placeholder:text-rose-900/30 focus:outline-none transition-colors duration-300", error ? "border-red-900/60 text-red-100" : "border-rose-900/40 focus:border-rose-500/60"),
							autoFocus: true
						})
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: isUnlocking,
						className: cn("mt-2 px-8 py-3 rounded-full font-cormorant uppercase tracking-[0.2em] text-sm transition-all duration-500", "bg-rose-900/20 text-rose-200 border border-rose-500/20", "hover:bg-rose-900/40 hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(245,198,208,0.2)]", isUnlocking && "opacity-0 scale-95"),
						children: "Unlock"
					})]
				})
			]
		})]
	}) });
}
//#endregion
//#region app/components/home/memoryService.ts
var supabase = createClient("https://bokphzstdxppjrdotrrr.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJva3BoenN0ZHhwcGpyZG90cnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNjEzMjksImV4cCI6MjA5MzgzNzMyOX0.HOQSn0ZKNnD_v9KE3OUI9fk-6wJgvoATiv_Vtbgu3z4");
function toMemory(row) {
	return {
		id: row.id,
		type: row.type,
		content: row.content,
		caption: row.caption || "",
		createdAt: new Date(row.created_at).getTime()
	};
}
async function fetchMemories() {
	const { data, error } = await supabase.from("memories").select("*").order("created_at", { ascending: false });
	if (error) {
		console.error("Supabase fetchMemories error:", error);
		return [];
	}
	return (data || []).map(toMemory);
}
async function addMemory(memory) {
	const { data, error } = await supabase.from("memories").insert([{
		type: memory.type,
		content: memory.content,
		caption: memory.caption
	}]).select().single();
	if (error) {
		console.error("Supabase addMemory error:", error);
		throw error;
	}
	return toMemory(data);
}
async function deleteMemory(id) {
	const { error } = await supabase.from("memories").delete().eq("id", id);
	if (error) {
		console.error("Supabase deleteMemory error:", error);
		throw error;
	}
}
async function uploadImage(base64Data) {
	const blob = await (await fetch(base64Data)).blob();
	const ext = blob.type.split("/")[1] || "jpg";
	const fileName = `memory_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
	const { error } = await supabase.storage.from("memory-images").upload(fileName, blob, {
		contentType: blob.type,
		upsert: false
	});
	if (error) {
		console.error("Supabase uploadImage error:", error);
		throw error;
	}
	const { data: { publicUrl } } = supabase.storage.from("memory-images").getPublicUrl(fileName);
	return publicUrl;
}
//#endregion
//#region app/components/home/MemoryEditor.tsx
function MemoryEditor({ isOpen, onClose, onSave }) {
	const [type, setType] = useState("text");
	const [content, setContent] = useState("");
	const [caption, setCaption] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const handleSave = async () => {
		if (!caption.trim() && type === "text") return;
		if (!imageUrl.trim() && type === "photo") return;
		setIsSaving(true);
		try {
			let finalImageUrl = imageUrl;
			if (type === "photo" && imageUrl.startsWith("data:")) finalImageUrl = await uploadImage(imageUrl);
			onSave({
				type,
				content: type === "photo" ? finalImageUrl : caption,
				caption: type === "photo" ? caption : content || "ذكرى سعيدة"
			});
			setContent("");
			setCaption("");
			setImageUrl("");
		} catch (err) {
			console.error("Failed to save memory:", err);
		} finally {
			setIsSaving(false);
			onClose();
		}
	};
	return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .5 },
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-[#080406]/90 backdrop-blur-xl px-4 py-8 overflow-y-auto",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				scale: .95,
				y: 30
			},
			animate: {
				scale: 1,
				y: 0
			},
			exit: {
				scale: .95,
				opacity: 0,
				y: 30
			},
			transition: {
				type: "spring",
				damping: 25,
				stiffness: 200
			},
			className: cn("relative w-full max-w-2xl p-8 md:p-12 rounded-[2.5rem] flex flex-col my-auto", "bg-gradient-to-br from-[#1a0810]/95 to-[#080406]/95 backdrop-blur-2xl", "border border-rose-900/30 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_0_30px_rgba(245,198,208,0.03)]"),
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: onClose,
					disabled: isSaving,
					className: "absolute top-6 right-6 text-rose-200/40 hover:text-rose-200 transition-colors disabled:opacity-50",
					children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "font-cormorant italic text-3xl md:text-4xl text-rose-200/90 tracking-widest mb-2 text-center",
					children: "Add a Memory"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "font-cormorant text-sm text-rose-300/40 mb-10 text-center uppercase tracking-[0.2em]",
					children: "Preserve a beautiful moment forever"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-center gap-4 mb-10",
					children: ["photo", "text"].map((t) => /* @__PURE__ */ jsx("button", {
						onClick: () => setType(t),
						className: cn("px-6 py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-sm transition-all duration-500", type === t ? "bg-[#2a0e18]/80 text-rose-100 border border-rose-500/40 shadow-[0_0_20px_rgba(245,198,208,0.15)]" : "bg-transparent text-rose-300/40 border border-rose-900/20 hover:text-rose-200/70"),
						children: t === "text" ? "Text Memory" : "Photo Memory"
					}, t))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-6 w-full",
					children: [
						type === "photo" && /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "font-cormorant text-rose-300/60 uppercase tracking-widest text-xs ml-2",
									children: "Upload Photo"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative w-full rounded-2xl bg-[#0a0507] border border-rose-900/30 overflow-hidden group hover:border-rose-500/40 transition-colors flex items-center justify-center border-dashed",
									children: [/* @__PURE__ */ jsx("input", {
										type: "file",
										accept: "image/*",
										onChange: (e) => {
											const file = e.target.files?.[0];
											if (file) {
												const reader = new FileReader();
												reader.onloadend = () => {
													setImageUrl(reader.result);
												};
												reader.readAsDataURL(file);
											}
										},
										className: "absolute inset-0 opacity-0 cursor-pointer z-10"
									}), /* @__PURE__ */ jsxs("div", {
										className: "w-full py-8 flex flex-col items-center justify-center gap-3 text-rose-900/40 group-hover:text-rose-400/60 transition-colors pointer-events-none",
										children: [/* @__PURE__ */ jsx(Upload, { className: "w-8 h-8" }), /* @__PURE__ */ jsx("span", {
											className: "font-cormorant italic tracking-widest text-sm",
											children: "Click to select an image"
										})]
									})]
								}),
								/* @__PURE__ */ jsx(AnimatePresence, { children: imageUrl && /* @__PURE__ */ jsx(motion.div, {
									initial: {
										opacity: 0,
										height: 0
									},
									animate: {
										opacity: 1,
										height: "auto"
									},
									className: "w-full mt-4 rounded-2xl overflow-hidden border border-rose-900/20 max-h-[300px] flex justify-center bg-[#050203]",
									children: /* @__PURE__ */ jsx("img", {
										src: imageUrl,
										alt: "Preview",
										className: "object-contain max-h-[300px]",
										onError: (e) => {
											e.currentTarget.style.display = "none";
										}
									})
								}) })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ jsx("label", {
								className: "font-cormorant text-rose-300/60 uppercase tracking-widest text-xs ml-2 text-right",
								children: type === "text" ? "Memory Text" : "Arabic Caption (Optional)"
							}), /* @__PURE__ */ jsx("textarea", {
								value: caption,
								onChange: (e) => setCaption(e.target.value),
								placeholder: type === "text" ? "اكتب ذكرياتك هنا..." : "وصف للصورة...",
								dir: "rtl",
								rows: type === "text" ? 6 : 3,
								className: "w-full rounded-2xl bg-[#0a0507] border border-rose-900/30 px-5 py-4 text-rose-100 font-ruqaa text-2xl md:text-3xl leading-relaxed placeholder:text-rose-900/40 focus:outline-none focus:border-rose-500/40 transition-colors resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
							})]
						}),
						type === "text" && /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ jsx("label", {
								className: "font-cormorant text-rose-300/60 uppercase tracking-widest text-xs ml-2 text-right",
								children: "Title / Date (Optional)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: content,
								onChange: (e) => setContent(e.target.value),
								placeholder: "عنوان أو تاريخ الذكرى...",
								dir: "rtl",
								className: "w-full rounded-2xl bg-[#0a0507] border border-rose-900/30 px-5 py-4 text-rose-100 font-ruqaa text-xl placeholder:text-rose-900/40 focus:outline-none focus:border-rose-500/40 transition-colors"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-4 mt-10",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: onClose,
						disabled: isSaving,
						className: "px-6 py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-sm text-rose-300/60 hover:text-rose-200 transition-colors",
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						onClick: handleSave,
						disabled: isSaving || (type === "text" ? !caption.trim() : !imageUrl.trim()),
						className: cn("px-8 py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-sm transition-all duration-500 flex items-center gap-2", "bg-rose-900/40 text-rose-100 border border-rose-500/40", "hover:bg-rose-900/60 hover:border-rose-400/60 hover:shadow-[0_0_25px_rgba(245,198,208,0.25)]", "disabled:opacity-40 disabled:hover:shadow-none disabled:cursor-not-allowed"),
						children: isSaving ? "Saving..." : "Save Memory"
					})]
				})
			]
		})
	}) });
}
//#endregion
//#region app/components/home/MemoryManager.tsx
function MemoryManager({ isOpen, onClose, memories, onMemoryDeleted }) {
	const [confirmDeleteId, setConfirmDeleteId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);
	const handleDelete = async (id) => {
		setDeletingId(id);
		await deleteMemory(id);
		onMemoryDeleted(id);
		setDeletingId(null);
		setConfirmDeleteId(null);
	};
	return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .5 },
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-[#080406]/90 backdrop-blur-xl px-4 py-8",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				scale: .95,
				y: 30
			},
			animate: {
				scale: 1,
				y: 0
			},
			exit: {
				scale: .95,
				opacity: 0,
				y: 30
			},
			transition: {
				type: "spring",
				damping: 25,
				stiffness: 200
			},
			className: cn("relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-[2.5rem]", "bg-gradient-to-br from-[#1a0810]/95 to-[#080406]/95 backdrop-blur-2xl", "border border-rose-900/30 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_0_30px_rgba(245,198,208,0.03)]"),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between p-8 pb-4 flex-shrink-0",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "font-cormorant italic text-2xl md:text-3xl text-rose-200/90 tracking-widest",
					children: "Manage Memories"
				}), /* @__PURE__ */ jsxs("p", {
					className: "font-cormorant text-xs text-rose-300/40 uppercase tracking-[0.2em] mt-1",
					children: [
						memories.length,
						" ",
						memories.length === 1 ? "memory" : "memories",
						" saved"
					]
				})] }), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "text-rose-200/40 hover:text-rose-200 transition-colors",
					children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar",
				children: memories.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-20 text-rose-400/30",
					children: [
						/* @__PURE__ */ jsx(FileText, { className: "w-12 h-12 mb-4" }),
						/* @__PURE__ */ jsx("p", {
							className: "font-cormorant italic text-lg",
							children: "No memories yet."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "font-cormorant text-sm mt-1",
							children: "Add your first moment to see it here."
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "flex flex-col gap-4",
					children: /* @__PURE__ */ jsx(AnimatePresence, { children: memories.map((memory) => /* @__PURE__ */ jsxs(motion.div, {
						layout: true,
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							x: -100,
							scale: .95
						},
						transition: { duration: .4 },
						className: cn("relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300", "bg-[#0d0509]/60 border border-rose-900/20 hover:border-rose-800/40", confirmDeleteId === memory.id && "border-red-900/40 bg-red-950/20", deletingId === memory.id && "opacity-50 pointer-events-none"),
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#080406] border border-rose-900/20 flex items-center justify-center",
								children: memory.type === "photo" && memory.content ? /* @__PURE__ */ jsx("img", {
									src: memory.content,
									alt: memory.caption,
									className: "w-full h-full object-cover",
									loading: "lazy",
									onError: (e) => {
										e.currentTarget.style.display = "none";
									}
								}) : /* @__PURE__ */ jsx("div", {
									className: "flex items-center justify-center text-rose-400/30",
									children: memory.type === "photo" ? /* @__PURE__ */ jsx(Image, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(FileText, { className: "w-6 h-6" })
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-2 mb-1",
										children: /* @__PURE__ */ jsx("span", {
											className: cn("px-2 py-0.5 rounded-full text-[10px] font-cormorant uppercase tracking-widest", memory.type === "photo" ? "bg-rose-900/30 text-rose-300/70" : "bg-[#1a0810] text-rose-300/60"),
											children: memory.type
										})
									}),
									/* @__PURE__ */ jsx("p", {
										className: "font-ruqaa text-sm md:text-base text-rose-100/80 truncate",
										dir: "rtl",
										children: memory.type === "text" ? memory.content : memory.caption || "No caption"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "font-cormorant text-xs text-rose-400/30 mt-1",
										children: new Date(memory.createdAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric"
										})
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex-shrink-0 flex items-center gap-2",
								children: confirmDeleteId === memory.id ? /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => setConfirmDeleteId(null),
										className: "px-3 py-1.5 rounded-full font-cormorant text-xs text-rose-300/60 hover:text-rose-200 transition-colors",
										children: "Cancel"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => handleDelete(memory.id),
										disabled: deletingId === memory.id,
										className: "px-4 py-1.5 rounded-full font-cormorant text-xs bg-red-900/40 text-red-200 border border-red-700/40 hover:bg-red-900/60 hover:border-red-600/60 transition-all duration-300 shadow-[0_0_10px_rgba(200,50,70,0.15)]",
										children: deletingId === memory.id ? "..." : "Delete"
									})]
								}) : /* @__PURE__ */ jsx("button", {
									onClick: () => setConfirmDeleteId(memory.id),
									className: "w-10 h-10 rounded-full flex items-center justify-center text-rose-400/30 hover:text-red-400/80 hover:bg-red-900/20 transition-all duration-300",
									children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
								})
							})
						]
					}, memory.id)) })
				})
			})]
		})
	}) });
}
//#endregion
//#region app/components/home/MemoryGallery.tsx
function isAuthenticated() {
	if (typeof window === "undefined") return false;
	return localStorage.getItem("isZiadAuthenticated") === "true";
}
function MemoryGallery() {
	const [activeTab, setActiveTab] = useState("photos");
	const [activeIndex, setActiveIndex] = useState(0);
	const [memories, setMemories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [isManagerOpen, setIsManagerOpen] = useState(false);
	const [pendingAction, setPendingAction] = useState(null);
	useEffect(() => {
		fetchMemories().then((data) => {
			setMemories(data);
			setIsLoading(false);
		});
	}, []);
	const filteredMemories = useMemo(() => {
		if (activeTab === "photos") return memories.filter((m) => m.type === "photo");
		return memories.filter((m) => m.type === "text");
	}, [activeTab, memories]);
	useEffect(() => {
		setActiveIndex(0);
	}, [activeTab]);
	useEffect(() => {
		if (filteredMemories.length > 0 && activeIndex >= filteredMemories.length) setActiveIndex(Math.max(0, filteredMemories.length - 1));
	}, [filteredMemories.length, activeIndex]);
	const next = () => setActiveIndex((i) => Math.min(filteredMemories.length - 1, i + 1));
	const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
	const handleProtectedAction = (action) => {
		if (isAuthenticated()) {
			if (action === "add") setIsEditorOpen(true);
			if (action === "manage") setIsManagerOpen(true);
		} else {
			setPendingAction(action);
			setIsAuthOpen(true);
		}
	};
	const handleAuthSuccess = () => {
		setIsAuthOpen(false);
		if (pendingAction === "add") setIsEditorOpen(true);
		if (pendingAction === "manage") setIsManagerOpen(true);
		setPendingAction(null);
	};
	const [cardWidth, setCardWidth] = useState(320);
	const [cardHeight, setCardHeight] = useState(440);
	const [cardOffset, setCardOffset] = useState(360);
	const sectionRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) setIsVisible(true);
		}, { threshold: .1 });
		observer.observe(section);
		return () => observer.disconnect();
	}, []);
	useEffect(() => {
		let timeout;
		const handleResize = () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (window.innerWidth < 768) {
					setCardWidth(260);
					setCardHeight(360);
					setCardOffset(280);
				} else {
					setCardWidth(320);
					setCardHeight(440);
					setCardOffset(360);
				}
			}, 150);
		};
		handleResize();
		window.addEventListener("resize", handleResize, { passive: true });
		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(timeout);
		};
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: "relative w-full py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden z-20",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: cn("text-center mb-8 md:mb-12 transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"),
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-cormorant italic text-3xl md:text-5xl text-rose-200/80 tracking-[0.2em] font-light drop-shadow-[0_0_15px_rgba(245,198,208,0.2)]",
					children: "Memories"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-3 font-cormorant text-rose-300/40 uppercase tracking-[0.3em] text-xs",
					children: "Choose a Moment"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn("flex flex-col items-center gap-5 w-full max-w-2xl px-4 mb-12 md:mb-16 z-20 transition-all duration-1000 delay-300", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-center gap-3 flex-wrap",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => handleProtectedAction("add"),
						className: cn("px-5 md:px-6 py-2 md:py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-500 flex items-center gap-2", "bg-gradient-to-r from-rose-900/40 to-[#18060e] text-rose-200 border border-rose-600/40", "shadow-[0_0_15px_rgba(245,198,208,0.15)] hover:scale-105 hover:shadow-[0_0_25px_rgba(245,198,208,0.3)] hover:border-rose-400/60"),
						children: [/* @__PURE__ */ jsxs("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [/* @__PURE__ */ jsx("path", { d: "M5 12h14" }), /* @__PURE__ */ jsx("path", { d: "M12 5v14" })]
						}), "Add Memory"]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => handleProtectedAction("manage"),
						className: cn("px-5 md:px-6 py-2 md:py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-500 flex items-center gap-2", "bg-transparent text-rose-300/50 border border-rose-900/30", "hover:text-rose-200 hover:border-rose-500/40 hover:bg-rose-900/10"),
						children: [/* @__PURE__ */ jsx(Settings, { className: "w-3.5 h-3.5" }), "Manage"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-center gap-2 md:gap-3",
					children: ["Photos", "Text"].map((tab) => {
						const tabKey = tab.toLowerCase();
						return /* @__PURE__ */ jsx("button", {
							onClick: () => setActiveTab(tabKey),
							className: cn("px-5 md:px-8 py-2 md:py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-500", activeTab === tabKey ? "bg-[#2a0e18]/80 text-rose-100 border border-rose-500/30 shadow-[0_0_20px_rgba(245,198,208,0.15)]" : "bg-transparent text-rose-300/40 border border-transparent hover:text-rose-200/70"),
							children: tab
						}, tab);
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative w-full h-[380px] md:h-[480px] flex justify-center items-center",
				children: [/* @__PURE__ */ jsx(SwipeSurface, {
					onSwipeLeft: next,
					onSwipeRight: prev
				}), filteredMemories.map((memory, i) => {
					const offsetIndex = i - activeIndex;
					if (Math.abs(offsetIndex) > 3) return null;
					const isActive = offsetIndex === 0;
					const xPos = offsetIndex * cardOffset;
					const cardScale = isActive ? 1 : .85;
					const cardOpacity = isActive ? 1 : Math.abs(offsetIndex) === 1 ? .4 : .1;
					return /* @__PURE__ */ jsx("div", {
						className: "absolute left-1/2 top-1/2 origin-center pointer-events-none transition-all duration-500 ease-out will-change-transform",
						style: {
							transform: `translate(-50%, -50%) translateX(${xPos}px) scale(${cardScale})`,
							opacity: cardOpacity,
							zIndex: 20 - Math.abs(offsetIndex),
							width: cardWidth,
							height: cardHeight
						},
						children: /* @__PURE__ */ jsx("div", {
							className: cn("w-full h-full rounded-[2rem] overflow-hidden", memory.type === "photo" ? "p-2 bg-gradient-to-br from-[#2a0e18]/80 to-[#1a0810]/90 border border-rose-900/40" : "p-6 md:p-8 bg-gradient-to-br from-[#1a0810]/95 to-[#080406]/95 border border-rose-800/30 flex flex-col items-center justify-center text-center", isActive ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "shadow-none"),
							children: memory.type === "photo" ? /* @__PURE__ */ jsx("div", {
								className: "w-full h-full relative rounded-[1.5rem] overflow-hidden bg-rose-950/20 flex flex-col items-center justify-center",
								children: memory.content ? /* @__PURE__ */ jsx("img", {
									src: memory.content,
									alt: memory.caption,
									className: "w-full h-full object-cover",
									loading: "lazy",
									onError: (e) => {
										e.currentTarget.style.display = "none";
										e.currentTarget.parentElement.innerHTML = `
                            <div class="flex flex-col items-center justify-center text-rose-400/30 gap-4 h-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                              <span class="font-cormorant italic text-sm text-center px-4">Image not found</span>
                            </div>
                          `;
									}
								}) : /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col items-center justify-center text-rose-400/30 gap-4",
									children: [/* @__PURE__ */ jsx(Image, { className: "w-8 h-8" }), /* @__PURE__ */ jsx("span", {
										className: "font-cormorant italic text-sm",
										children: "No Image"
									})]
								})
							}) : /* @__PURE__ */ jsxs("p", {
								className: "font-ruqaa text-2xl md:text-3xl leading-relaxed text-rose-100/90",
								dir: "rtl",
								children: [
									"\"",
									memory.content,
									"\""
								]
							})
						})
					}, memory.id);
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-10 md:mt-12 flex flex-col items-center z-40 w-full max-w-lg px-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-center gap-6 md:gap-8 mb-5",
					children: [
						/* @__PURE__ */ jsx("button", {
							onClick: prev,
							disabled: activeIndex === 0,
							className: "w-10 h-10 md:w-12 md:h-12 rounded-full border border-rose-900/30 flex items-center justify-center text-rose-300/60 hover:text-rose-200 hover:border-rose-500/40 hover:bg-rose-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0",
							children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-1.5 max-w-[200px] overflow-hidden flex-wrap justify-center",
							children: filteredMemories.map((_, i) => /* @__PURE__ */ jsx("div", { className: cn("h-1.5 rounded-full transition-all duration-500 flex-shrink-0", i === activeIndex ? "w-5 bg-rose-300/80 shadow-[0_0_8px_rgba(245,198,208,0.5)]" : "w-1.5 bg-rose-900/40") }, i))
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: next,
							disabled: activeIndex === filteredMemories.length - 1,
							className: "w-10 h-10 md:w-12 md:h-12 rounded-full border border-rose-900/30 flex items-center justify-center text-rose-300/60 hover:text-rose-200 hover:border-rose-500/40 hover:bg-rose-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0",
							children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
						})
					]
				}), !isLoading && filteredMemories.length > 0 ? /* @__PURE__ */ jsx("div", {
					className: "h-10 flex items-center justify-center transition-opacity duration-500",
					children: /* @__PURE__ */ jsx("p", {
						className: "font-ruqaa text-xl md:text-2xl text-rose-200/80 tracking-wide text-center",
						dir: "rtl",
						children: filteredMemories[activeIndex]?.caption
					})
				}) : !isLoading && filteredMemories.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "h-10 flex items-center justify-center",
					children: /* @__PURE__ */ jsx("p", {
						className: "font-cormorant italic text-rose-400/40 text-lg",
						children: "No memories found. Add your first moment."
					})
				}) : null]
			}),
			/* @__PURE__ */ jsx(AuthModal, {
				isOpen: isAuthOpen,
				onClose: () => {
					setIsAuthOpen(false);
					setPendingAction(null);
				},
				onSuccess: handleAuthSuccess
			}),
			/* @__PURE__ */ jsx(MemoryEditor, {
				isOpen: isEditorOpen,
				onClose: () => setIsEditorOpen(false),
				onSave: async (newMemory) => {
					const added = await addMemory(newMemory);
					setMemories((prev) => [added, ...prev]);
					setActiveIndex(0);
				}
			}),
			/* @__PURE__ */ jsx(MemoryManager, {
				isOpen: isManagerOpen,
				onClose: () => setIsManagerOpen(false),
				memories,
				onMemoryDeleted: (id) => {
					setMemories((prev) => prev.filter((m) => m.id !== id));
				}
			})
		]
	});
}
/** Lightweight swipe surface — replaces Framer Motion drag */
function SwipeSurface({ onSwipeLeft, onSwipeRight }) {
	const startX = useRef(0);
	return /* @__PURE__ */ jsx("div", {
		className: "absolute inset-0 z-30 touch-pan-y",
		onTouchStart: useCallback((e) => {
			startX.current = e.touches[0].clientX;
		}, []),
		onTouchEnd: useCallback((e) => {
			const delta = startX.current - e.changedTouches[0].clientX;
			if (Math.abs(delta) > 40) if (delta > 0) onSwipeLeft();
			else onSwipeRight();
		}, [onSwipeLeft, onSwipeRight])
	});
}
//#endregion
//#region app/components/home/FinalEnding.tsx
function FinalEnding() {
	const sectionRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) setIsVisible(true);
		}, { threshold: .1 });
		observer.observe(section);
		const handleScroll = () => {
			const rect = section.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const totalScrollDistance = rect.height;
			const scrolledInPixels = windowHeight - rect.top;
			if (scrolledInPixels > 0 && scrolledInPixels <= totalScrollDistance) {
				let p = scrolledInPixels / totalScrollDistance;
				p = Math.max(0, Math.min(1, p));
				setProgress(p);
			} else if (scrolledInPixels > totalScrollDistance) setProgress(1);
			else setProgress(0);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: "relative w-full min-h-[120vh] flex flex-col items-center justify-center overflow-hidden z-20",
		style: {
			backgroundColor: `rgba(8, 4, 6, ${Math.max(0, (progress - .7) * 3.33)})`,
			transition: "background-color 0.1s ease-out"
		},
		children: [
			/* @__PURE__ */ jsx("div", { className: cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none blur-[120px] transition-all duration-[3000ms] ease-in-out", isVisible ? "opacity-30 scale-100" : "opacity-0 scale-50", "bg-[radial-gradient(circle_at_center,#d47088_0%,transparent_70%)]") }),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-60",
				children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsx("div", {
					className: "absolute rounded-full bg-rose-200/40 animate-end-particle",
					style: {
						width: Math.random() * 3 + 1 + "px",
						height: Math.random() * 3 + 1 + "px",
						left: Math.random() * 100 + "%",
						top: Math.random() * 100 + "%",
						animationDelay: Math.random() * 5 + "s",
						animationDuration: Math.random() * 10 + 15 + "s"
					}
				}, i))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 flex flex-col items-center text-center px-6 w-full",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center w-full",
					style: { opacity: Math.max(0, 1 - (progress - .85) * 6.66) },
					children: [
						/* @__PURE__ */ jsxs("h2", {
							className: cn("font-cormorant italic text-4xl md:text-6xl lg:text-7xl text-rose-100/90 font-light tracking-[0.05em] leading-tight mb-8 drop-shadow-[0_0_25px_rgba(245,198,208,0.3)] animate-end-float", "transition-all duration-[2000ms] delay-[500ms]", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"),
							children: [
								"And in every universe…",
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx("span", {
									className: "block mt-4 text-3xl md:text-5xl lg:text-6xl text-rose-200/80",
									children: "I’d still choose you."
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: cn("font-ruqaa text-2xl md:text-3xl lg:text-4xl text-rose-300/70 tracking-wide", "transition-all duration-[2000ms] delay-[1500ms]", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"),
							dir: "rtl",
							children: "وهفضل أختارك في كل مرة."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: cn("my-16 md:my-24 relative flex items-center justify-center", "transition-all duration-[2000ms] delay-[2500ms]", isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"),
							children: [/* @__PURE__ */ jsx("div", { className: "absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" }), /* @__PURE__ */ jsx(Heart, { className: "w-5 h-5 md:w-6 md:h-6 text-rose-400/60 fill-rose-400/20 drop-shadow-[0_0_15px_rgba(245,198,208,0.4)] animate-end-pulse z-10" })]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: cn("font-vibes text-4xl md:text-5xl lg:text-6xl text-rose-200 tracking-wider absolute bottom-12", "transition-all duration-[3000ms] delay-[3500ms]", "drop-shadow-[0_0_20px_rgba(245,198,208,0.4)]", isVisible ? "opacity-100" : "opacity-0 blur-sm"),
					children: [
						"Ziad ",
						/* @__PURE__ */ jsx("span", {
							className: "font-cormorant italic text-rose-400/50 mx-2 text-3xl md:text-4xl",
							children: "×"
						}),
						" Rahma"
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#080406_100%)] z-20" })
		]
	});
}
//#endregion
//#region app/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	default: () => home_default,
	meta: () => meta
});
function meta({}) {
	return [{ title: "Happy Birthday Rahma" }, {
		name: "description",
		content: "A cinematic birthday experience for Rahma"
	}];
}
var home_default = UNSAFE_withComponentProps(function Home() {
	const [showSplash, setShowSplash] = useState(true);
	const sceneRef = useRef(null);
	const videoRef = useRef(null);
	const scrollToScene = useCallback(() => {
		sceneRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	}, []);
	const scrollToVideo = useCallback(() => {
		videoRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, []);
	return /* @__PURE__ */ jsx("main", {
		className: "w-full bg-bg-dark text-text-light font-cormorant",
		children: showSplash ? /* @__PURE__ */ jsx(SplashScreen, { onComplete: () => setShowSplash(false) }) : /* @__PURE__ */ jsxs(Background, {
			flow: true,
			children: [
				/* @__PURE__ */ jsxs("section", {
					ref: sceneRef,
					id: "interactive-scene",
					className: "relative w-full min-h-screen flex flex-col items-center justify-center",
					children: [
						/* @__PURE__ */ jsx(RelationshipTimer, {}),
						/* @__PURE__ */ jsx(InteractiveScene, {}),
						/* @__PURE__ */ jsxs("button", {
							onClick: scrollToVideo,
							className: "absolute bottom-8 left-0 right-0 mx-auto w-fit flex flex-col items-center gap-2 text-rose-200/40 hover:text-rose-200/70 transition-colors duration-500 cursor-pointer z-20 animate-gentle-bounce",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-playfair text-xs tracking-[0.3em] uppercase",
								children: "Scroll"
							}), /* @__PURE__ */ jsx("svg", {
								width: "20",
								height: "20",
								viewBox: "0 0 20 20",
								fill: "none",
								className: "opacity-60",
								children: /* @__PURE__ */ jsx("path", {
									d: "M10 4L10 16M10 16L5 11M10 16L15 11",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", { className: "h-[10vh] w-full pointer-events-none" }),
				/* @__PURE__ */ jsx("div", {
					ref: videoRef,
					children: /* @__PURE__ */ jsx(CinematicVideo, {
						onNavigateUp: scrollToScene,
						children: /* @__PURE__ */ jsx(FinalOverlay, {})
					})
				}),
				/* @__PURE__ */ jsx("div", { className: "h-[15vh] w-full pointer-events-none" }),
				/* @__PURE__ */ jsx(VoiceNoteSection, {}),
				/* @__PURE__ */ jsx("div", { className: "h-[15vh] w-full pointer-events-none" }),
				/* @__PURE__ */ jsx(MemoryGallery, {}),
				/* @__PURE__ */ jsx("div", { className: "h-[15vh] w-full pointer-events-none" }),
				/* @__PURE__ */ jsx(CinematicLetter, {}),
				/* @__PURE__ */ jsx("div", { className: "h-[20vh] w-full pointer-events-none" }),
				/* @__PURE__ */ jsx(FinalEnding, {})
			]
		})
	});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-BP_Joy3F.js",
		"imports": ["/assets/jsx-runtime-BbnX-Dyu.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-lcVaCFE_.js",
			"imports": ["/assets/jsx-runtime-BbnX-Dyu.js"],
			"css": ["/assets/root-BxNX2MPo.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-CQRyuitp.js",
			"imports": ["/assets/jsx-runtime-BbnX-Dyu.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-3a23b141.js",
	"version": "3a23b141",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
