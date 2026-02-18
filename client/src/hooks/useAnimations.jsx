import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

// ─── Reusable Animation Variants ───────────────────────────

export const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export const fadeInDown = {
    hidden: { opacity: 0, y: -30 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (delay = 0) => ({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export const popIn = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (delay = 0) => ({
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            delay,
            type: 'spring',
            stiffness: 260,
            damping: 20,
        },
    }),
};

export const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

// ─── FadeIn Component ──────────────────────────────────────

export function FadeIn({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className = '',
    once = true,
    amount = 0.3,
    ...props
}) {
    const directionMap = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: -60 },
        right: { x: 60 },
        none: {},
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directionMap[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once, amount }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

// ─── StaggerContainer Component ────────────────────────────

export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.08,
    delayChildren = 0.1,
    once = true,
    amount = 0.2,
    ...props
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={{
                hidden: { opacity: 1 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren,
                    },
                },
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

// ─── StaggerItem Component ─────────────────────────────────

export function StaggerItem({
    children,
    className = '',
    variant = 'fadeUp',
    ...props
}) {
    const variants = {
        fadeUp: {
            hidden: { opacity: 0, y: 25 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
            },
        },
        fadeLeft: {
            hidden: { opacity: 0, x: -30 },
            visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
            },
        },
        pop: {
            hidden: { opacity: 0, scale: 0.6 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                },
            },
        },
        scaleUp: {
            hidden: { opacity: 0, scale: 0.85 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
            },
        },
    };

    return (
        <motion.div variants={variants[variant]} className={className} {...props}>
            {children}
        </motion.div>
    );
}

// ─── CountUp Component ─────────────────────────────────────

export function CountUp({ end, duration = 2, suffix = '', prefix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const numericEnd = parseInt(end.toString().replace(/[^0-9]/g, ''));

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * numericEnd));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, numericEnd, duration]);

    return (
        <span ref={ref}>
            {prefix}
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

// ─── Floating Animation (decorative) ──────────────────────

export function FloatingElement({
    children,
    className = '',
    duration = 6,
    distance = 15,
}) {
    return (
        <motion.div
            animate={{
                y: [-distance, distance, -distance],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─── Glow Pulse (background effect) ───────────────────────

export function GlowPulse({ className = '' }) {
    return (
        <motion.div
            animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={className}
        />
    );
}
