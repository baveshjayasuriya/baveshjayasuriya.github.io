// Advanced SOC Cybersecurity Portfolio - 3D Animation System
class SOCPortfolio {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.socHub = null;
        this.alertParticles = [];
        this.dataStreams = [];
        this.monitorScreens = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isLoaded = false;
        this.alertLevels = ['low', 'medium', 'high', 'critical'];
        
        this.init();
    }

    init() {
        this.setupThreeJS();
        this.createSOCCommandCenter();
        this.createSecurityAlertSystem();
        this.createDataFlowVisualization();
        this.setupEventListeners();
        this.initScrollAnimations();
        this.initTextAnimations();
        this.initSkillAnimations();
        this.initFormValidation();
        this.initCounters();
        this.animate();
    }

    setupThreeJS() {
        const canvas = document.getElementById('soc-canvas');
        const container = canvas.parentElement;
        
        // Scene setup with SOC environment
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 200);

        // Camera setup for SOC perspective
        this.camera = new THREE.PerspectiveCamera(
            60, 
            container.offsetWidth / container.offsetHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 5, 35);

        // Renderer setup with enhanced settings
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createSOCCommandCenter() {
        // Central SOC Hub - Main monitoring station
        const hubGeometry = new THREE.CylinderGeometry(8, 10, 2, 12);
        const hubMaterial = new THREE.MeshLambertMaterial({
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.8,
            wireframe: false
        });
        
        this.socHub = new THREE.Mesh(hubGeometry, hubMaterial);
        this.socHub.position.y = -5;
        this.scene.add(this.socHub);

        // Holographic SOC ring
        const ringGeometry = new THREE.RingGeometry(12, 15, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x0078d4,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        
        this.holographicRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.holographicRing.rotation.x = -Math.PI / 2;
        this.holographicRing.position.y = -3;
        this.scene.add(this.holographicRing);

        // Create monitoring screens around the hub
        this.createMonitoringScreens();
        
        // Create incident response nodes
        this.createIncidentNodes();
        
        // Add lighting for SOC environment
        this.setupSOCLighting();
    }

    createMonitoringScreens() {
        this.monitorScreens = [];
        const screenCount = 8;
        
        for (let i = 0; i < screenCount; i++) {
            const screenGeometry = new THREE.PlaneGeometry(3, 2);
            const screenMaterial = new THREE.MeshBasicMaterial({
                color: 0x0078d4,
                transparent: true,
                opacity: 0.7
            });
            
            const screen = new THREE.Mesh(screenGeometry, screenMaterial);
            const angle = (i / screenCount) * Math.PI * 2;
            const radius = 18;
            
            screen.position.x = Math.cos(angle) * radius;
            screen.position.z = Math.sin(angle) * radius;
            screen.position.y = 2;
            screen.lookAt(0, 2, 0);
            
            // Add screen frame
            const frameGeometry = new THREE.PlaneGeometry(3.2, 2.2);
            const frameMaterial = new THREE.MeshBasicMaterial({
                color: 0x333333,
                transparent: true,
                opacity: 0.9
            });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.z = -0.1;
            screen.add(frame);
            
            screen.userData = {
                angle: angle,
                alertStatus: this.alertLevels[Math.floor(Math.random() * this.alertLevels.length)],
                lastUpdate: Date.now()
            };
            
            this.monitorScreens.push(screen);
            this.scene.add(screen);
        }
    }

    createIncidentNodes() {
        this.incidentNodes = [];
        const nodeCount = 12;
        
        for (let i = 0; i < nodeCount; i++) {
            const nodeGeometry = new THREE.OctahedronGeometry(0.8);
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: this.getAlertColor('medium'),
                transparent: true,
                opacity: 0.8
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = 25;
            
            node.position.x = Math.cos(angle) * radius;
            node.position.z = Math.sin(angle) * radius;
            node.position.y = Math.sin(Date.now() * 0.001 + i) * 3;
            
            node.userData = {
                angle: angle,
                originalY: node.position.y,
                alertLevel: this.alertLevels[Math.floor(Math.random() * this.alertLevels.length)],
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            this.incidentNodes.push(node);
            this.scene.add(node);
        }
    }

    createSecurityAlertSystem() {
        // Create particle system for security alerts
        const alertCount = 500;
        const positions = new Float32Array(alertCount * 3);
        const colors = new Float32Array(alertCount * 3);
        const sizes = new Float32Array(alertCount);
        const alertTypes = new Float32Array(alertCount);
        
        this.alertData = [];
        
        for (let i = 0; i < alertCount; i++) {
            const i3 = i * 3;
            
            // Position alerts in SOC space
            const radius = Math.random() * 40 + 10;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 20;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = height;
            positions[i3 + 2] = Math.sin(angle) * radius;
            
            // Alert severity colors
            const alertType = Math.floor(Math.random() * 4);
            alertTypes[i] = alertType;
            
            const alertColor = this.getAlertColorRGB(alertType);
            colors[i3] = alertColor.r;
            colors[i3 + 1] = alertColor.g;
            colors[i3 + 2] = alertColor.b;
            
            sizes[i] = Math.random() * 4 + 2;
            
            this.alertData.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05
                ),
                originalSize: sizes[i],
                alertType: alertType,
                phase: Math.random() * Math.PI * 2,
                lifetime: Math.random() * 1000 + 500
            });
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 3));
        geometry.setAttribute('alertType', new THREE.BufferAttribute(alertTypes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mousePos: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                attribute float alertType;
                varying vec3 vColor;
                varying float vAlertType;
                uniform float time;
                uniform vec2 mousePos;
                
                void main() {
                    vColor = color;
                    vAlertType = alertType;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Mouse interaction for SOC monitoring
                    float mouseDistance = distance(position.xy, mousePos * 30.0);
                    float mouseEffect = smoothstep(15.0, 0.0, mouseDistance);
                    
                    // Alert pulsing based on severity
                    float pulse = sin(time * (2.0 + alertType)) * 0.3 + 0.7;
                    
                    gl_PointSize = size * pulse * (1.0 + mouseEffect) * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlertType;
                
                void main() {
                    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                    if (r > 0.5) discard;
                    
                    // Different patterns for different alert types
                    float alpha = 1.0;
                    if (vAlertType >= 3.0) {
                        // Critical alerts - pulsing
                        alpha = 0.8 + sin(r * 20.0) * 0.2;
                    } else if (vAlertType >= 2.0) {
                        // High alerts - ring pattern
                        alpha = smoothstep(0.3, 0.35, r) * smoothstep(0.5, 0.45, r);
                    } else {
                        // Medium/Low alerts - solid
                        alpha = 1.0 - smoothstep(0.3, 0.5, r);
                    }
                    
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });
        
        this.alertParticleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.alertParticleSystem);
    }

    createDataFlowVisualization() {
        this.dataStreams = [];
        const streamCount = 30;
        
        for (let i = 0; i < streamCount; i++) {
            const points = [];
            const startRadius = 15 + Math.random() * 20;
            const startAngle = Math.random() * Math.PI * 2;
            
            const startPoint = new THREE.Vector3(
                Math.cos(startAngle) * startRadius,
                (Math.random() - 0.5) * 10,
                Math.sin(startAngle) * startRadius
            );
            
            // Data flows toward SOC hub
            const endPoint = new THREE.Vector3(0, 0, 0);
            
            // Create flowing path with curves
            for (let j = 0; j <= 20; j++) {
                const t = j / 20;
                const point = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);
                
                // Add spiral effect for data flow
                const spiral = t * Math.PI * 4;
                point.x += Math.sin(spiral + startAngle) * (1 - t) * 2;
                point.y += Math.cos(spiral + startAngle) * (1 - t) * 2;
                
                points.push(point);
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: i % 3 === 0 ? 0x0078d4 : i % 3 === 1 ? 0x00ffff : 0xe01e5a,
                transparent: true,
                opacity: 0.4
            });
            
            const line = new THREE.Line(geometry, material);
            line.userData = { 
                speed: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2,
                flowDirection: 1
            };
            
            this.dataStreams.push(line);
            this.scene.add(line);
        }
    }

    setupSOCLighting() {
        // Ambient lighting for SOC environment
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Main SOC spotlight
        const spotLight = new THREE.SpotLight(0x0078d4, 1, 100, Math.PI / 6, 0.1);
        spotLight.position.set(0, 20, 0);
        spotLight.target.position.set(0, 0, 0);
        spotLight.castShadow = true;
        this.scene.add(spotLight);
        this.scene.add(spotLight.target);

        // Alert indicator lights
        const alertLight1 = new THREE.PointLight(0xe01e5a, 0.8, 30);
        alertLight1.position.set(15, 5, 15);
        this.scene.add(alertLight1);

        const alertLight2 = new THREE.PointLight(0x00ffff, 0.6, 25);
        alertLight2.position.set(-15, 5, -15);
        this.scene.add(alertLight2);
    }

    getAlertColor(level) {
        switch(level) {
            case 'critical': return 0xe01e5a;
            case 'high': return 0xff6b35;
            case 'medium': return 0xffa500;
            case 'low': return 0x00ff41;
            default: return 0x0078d4;
        }
    }

    getAlertColorRGB(alertType) {
        switch(alertType) {
            case 3: return { r: 0.88, g: 0.12, b: 0.35 }; // Critical
            case 2: return { r: 1.0, g: 0.42, b: 0.21 };  // High
            case 1: return { r: 1.0, g: 0.65, b: 0.0 };   // Medium
            case 0: return { r: 0.0, g: 1.0, b: 0.25 };   // Low
            default: return { r: 0.0, g: 0.47, b: 0.83 };
        }
    }

    setupEventListeners() {
        // Enhanced mouse tracking for SOC interaction
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Smooth scrolling with SOC theme
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: target,
                        ease: "power2.inOut"
                    });
                }
            });
        });

        // Enhanced project card interactions
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.4,
                    scale: 1.02,
                    rotationX: 2,
                    rotationY: 2,
                    ease: "power2.out"
                });
                
                // Add scanning effect
                this.addProjectScanEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.4,
                    scale: 1,
                    rotationX: 0,
                    rotationY: 0,
                    ease: "power2.out"
                });
            });
        });

        // Skill category hover effects
        document.querySelectorAll('.skill-category').forEach(category => {
            category.addEventListener('mouseenter', () => {
                this.triggerSkillAlert(category);
            });
        });
    }

    addProjectScanEffect(card) {
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #0078d4, #00ffff, transparent);
            transition: left 0.8s ease;
            z-index: 10;
        `;
        
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(scanLine);
        
        setTimeout(() => {
            scanLine.style.left = '100%';
            setTimeout(() => scanLine.remove(), 800);
        }, 50);
    }

    triggerSkillAlert(category) {
        const alertIndicator = document.createElement('div');
        alertIndicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 8px;
            height: 8px;
            background: #00ff41;
            border-radius: 50%;
            box-shadow: 0 0 15px #00ff41;
            animation: alertPulse 1s ease-out;
        `;
        
        category.style.position = 'relative';
        category.appendChild(alertIndicator);
        
        setTimeout(() => alertIndicator.remove(), 1000);
    }

    initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero stats with SOC-style animation
        gsap.set('.stat-item', { opacity: 0, y: 50, scale: 0.8 });
        gsap.to('.stat-item', {
            duration: 1.2,
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.2,
            delay: 2.5,
            ease: "back.out(1.7)"
        });

        // Security badges animation
        gsap.set('.badge', { opacity: 0, rotationX: -90 });
        gsap.to('.badge', {
            duration: 0.8,
            opacity: 1,
            rotationX: 0,
            stagger: 0.15,
            delay: 3.5,
            ease: "power2.out"
        });

        // Section reveal with SOC monitoring effect
        gsap.utils.toArray('section:not(.hero)').forEach(section => {
            const header = section.querySelector('.section-header');
            if (header) {
                gsap.fromTo(header, 
                    { opacity: 0, y: 100, rotationX: 45 },
                    {
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        duration: 1.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        });

        // Timeline items with incident response animation
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, x: -150, rotationY: -15 },
                {
                    opacity: 1,
                    x: 0,
                    rotationY: 0,
                    duration: 1,
                    delay: index * 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Skills animation trigger
        ScrollTrigger.create({
            trigger: '.skills',
            start: "top 70%",
            onEnter: () => {
                this.animateSkillBars();
                this.triggerSkillsAlert();
            }
        });

        // Projects cards with staggered animation
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.fromTo(card,
                { opacity: 0, y: 100, rotationX: 20 },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    initTextAnimations() {
        // Enhanced glitch effect for name
        const glitchText = document.querySelector('.glitch-text');
        if (glitchText) {
            glitchText.setAttribute('data-text', glitchText.textContent);
        }

        // SOC decrypt animation for subtitle
        const decryptText = document.querySelector('.decrypt-text');
        if (decryptText) {
            this.socDecryptAnimation(decryptText);
        }

        // Matrix effect for tagline
        const matrixText = document.querySelector('.matrix-text');
        if (matrixText) {
            setTimeout(() => this.matrixDataFlow(matrixText), 3000);
        }
    }

    socDecryptAnimation(element) {
        const originalText = element.textContent;
        const socChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789░▒▓█▄▌▐▀';
        let iterations = 0;

        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return socChars[Math.floor(Math.random() * socChars.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
                element.textContent = originalText;
            }
            iterations += 1 / 3;
        }, 50);
    }

    matrixDataFlow(element) {
        const originalText = element.textContent;
        const dataChars = '01█▓▒░';
        
        let iterations = 0;
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map(() => dataChars[Math.floor(Math.random() * dataChars.length)])
                .join('');
            
            iterations++;
            if (iterations > 15) {
                clearInterval(interval);
                // Gradual reveal
                this.revealText(element, originalText);
            }
        }, 80);
    }

    revealText(element, originalText) {
        let revealIndex = 0;
        const revealInterval = setInterval(() => {
            let displayText = originalText.substring(0, revealIndex + 1);
            displayText += '█'.repeat(Math.max(0, originalText.length - revealIndex - 1));
            element.textContent = displayText;
            
            revealIndex++;
            if (revealIndex >= originalText.length) {
                clearInterval(revealInterval);
                element.textContent = originalText;
            }
        }, 100);
    }

    animateSkillBars() {
        document.querySelectorAll('.skill-item').forEach((item, index) => {
            const level = parseInt(item.getAttribute('data-level'));
            const progressBar = item.querySelector('.skill-progress');
            
            gsap.to(progressBar, {
                width: level + '%',
                duration: 2,
                delay: index * 0.1,
                ease: "power2.out",
                onComplete: () => {
                    // Add completion effect
                    gsap.to(progressBar, {
                        boxShadow: '0 0 25px rgba(0, 120, 212, 0.8)',
                        duration: 0.5,
                        repeat: 1,
                        yoyo: true
                    });
                }
            });
        });
    }

    triggerSkillsAlert() {
        // Simulate SOC alert for skills assessment
        const alertBanner = document.createElement('div');
        alertBanner.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: rgba(0, 120, 212, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: bold;
            font-size: 0.9rem;
            z-index: 1001;
            box-shadow: 0 0 20px rgba(0, 120, 212, 0.5);
            transform: translateX(400px);
            transition: transform 0.5s ease;
        `;
        alertBanner.textContent = '🔍 SOC SKILLS ANALYSIS COMPLETE';
        
        document.body.appendChild(alertBanner);
        
        setTimeout(() => {
            alertBanner.style.transform = 'translateX(0)';
            setTimeout(() => {
                alertBanner.style.transform = 'translateX(400px)';
                setTimeout(() => alertBanner.remove(), 500);
            }, 3000);
        }, 100);
    }

    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        ScrollTrigger.create({
            trigger: '.hero-stats',
            start: "top 80%",
            onEnter: () => {
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const obj = { value: 0 };
                    
                    gsap.to(obj, {
                        value: target,
                        duration: 2.5,
                        ease: "power2.out",
                        onUpdate: () => {
                            counter.textContent = Math.floor(obj.value).toLocaleString();
                        },
                        onComplete: () => {
                            // Add final pulse effect
                            gsap.to(counter, {
                                scale: 1.1,
                                duration: 0.2,
                                repeat: 1,
                                yoyo: true
                            });
                        }
                    });
                });
            }
        });
    }

    initFormValidation() {
        const form = document.querySelector('.contact-form');
        const inputs = form.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateField(e.target);
            });
            
            input.addEventListener('focus', (e) => {
                this.addSOCScanEffect(e.target);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSecureFormSubmission();
        });
    }

    validateField(field) {
        const validation = field.parentElement.querySelector('.form-validation');
        let isValid = false;
        
        switch(field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                break;
            case 'text':
                isValid = field.value.trim().length >= 2;
                break;
            default:
                isValid = field.value.trim().length > 0;
        }
        
        validation.className = `form-validation ${isValid ? 'valid' : 'invalid'}`;
        
        if (isValid) {
            gsap.to(field, {
                boxShadow: '0 0 25px rgba(0, 255, 65, 0.4)',
                duration: 0.3
            });
        } else if (field.value.length > 0) {
            gsap.to(field, {
                boxShadow: '0 0 25px rgba(224, 30, 90, 0.4)',
                duration: 0.3
            });
        }
    }

    addSOCScanEffect(field) {
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #0078d4, #00ffff, transparent);
            transition: left 0.6s ease;
            z-index: 1;
        `;
        
        field.parentElement.style.position = 'relative';
        field.parentElement.appendChild(scanLine);
        
        setTimeout(() => {
            scanLine.style.left = '100%';
            setTimeout(() => scanLine.remove(), 600);
        }, 10);
    }

    handleSecureFormSubmission() {
        const button = document.querySelector('.contact-form .btn');
        const originalText = button.querySelector('.btn-text').textContent;
        
        // SOC-style security scan simulation
        button.querySelector('.btn-text').textContent = 'INITIATING SECURITY SCAN...';
        button.disabled = true;
        
        gsap.to(button, {
            backgroundColor: '#e01e5a',
            duration: 0.3
        });
        
        // Scan phase
        setTimeout(() => {
            button.querySelector('.btn-text').textContent = 'VALIDATING CREDENTIALS...';
            gsap.to(button, {
                backgroundColor: '#ffa500',
                duration: 0.3
            });
        }, 1000);
        
        // Approval phase
        setTimeout(() => {
            button.querySelector('.btn-text').textContent = 'SECURE TRANSMISSION AUTHORIZED';
            gsap.to(button, {
                backgroundColor: '#00ff41',
                duration: 0.3
            });
            
            // Reset
            setTimeout(() => {
                button.querySelector('.btn-text').textContent = originalText;
                button.disabled = false;
                gsap.to(button, {
                    backgroundColor: '',
                    duration: 0.3
                });
            }, 2500);
        }, 2200);
    }

    animate() {
        const time = Date.now() * 0.001;
        
        // Animate SOC Hub
        if (this.socHub) {
            this.socHub.rotation.y += 0.003;
            this.socHub.position.y = -5 + Math.sin(time * 0.5) * 0.2;
        }
        
        // Animate holographic ring
        if (this.holographicRing) {
            this.holographicRing.rotation.z += 0.005;
            this.holographicRing.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
        }
        
        // Animate monitoring screens
        this.monitorScreens.forEach((screen, index) => {
            screen.userData.angle += 0.002;
            const radius = 18 + Math.sin(time + index) * 0.5;
            screen.position.x = Math.cos(screen.userData.angle) * radius;
            screen.position.z = Math.sin(screen.userData.angle) * radius;
            
            // Update screen colors based on alert status
            if (Date.now() - screen.userData.lastUpdate > 3000) {
                screen.userData.alertStatus = this.alertLevels[Math.floor(Math.random() * this.alertLevels.length)];
                screen.material.color.setHex(this.getAlertColor(screen.userData.alertStatus));
                screen.userData.lastUpdate = Date.now();
            }
            
            screen.lookAt(0, 2, 0);
        });
        
        // Animate incident nodes
        this.incidentNodes.forEach((node, index) => {
            node.userData.angle += 0.008;
            node.position.x = Math.cos(node.userData.angle) * 25;
            node.position.z = Math.sin(node.userData.angle) * 25;
            node.position.y = Math.sin(time * 0.5 + node.userData.pulsePhase) * 4;
            
            node.rotation.x += 0.01;
            node.rotation.y += 0.015;
            
            // Update alert level colors
            const pulse = Math.sin(time * 2 + node.userData.pulsePhase) * 0.5 + 0.5;
            node.material.color.setHex(this.getAlertColor(node.userData.alertLevel));
            node.material.opacity = 0.6 + pulse * 0.3;
        });
        
        // Animate data streams
        this.dataStreams.forEach(stream => {
            stream.material.opacity = 0.2 + Math.sin(time * 2 + stream.userData.phase) * 0.2;
            stream.rotation.y += stream.userData.speed;
        });
        
        // Animate alert particles
        if (this.alertParticleSystem) {
            const positions = this.alertParticleSystem.geometry.attributes.position.array;
            const sizes = this.alertParticleSystem.geometry.attributes.size.array;
            
            for (let i = 0; i < this.alertData.length; i++) {
                const i3 = i * 3;
                const particle = this.alertData[i];
                
                // Update positions with SOC-style movement
                positions[i3] += particle.velocity.x;
                positions[i3 + 1] += particle.velocity.y;
                positions[i3 + 2] += particle.velocity.z;
                
                // Boundary check and regenerate
                const distance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2);
                if (distance > 60) {
                    const radius = Math.random() * 40 + 20;
                    const angle = Math.random() * Math.PI * 2;
                    positions[i3] = Math.cos(angle) * radius;
                    positions[i3 + 1] = (Math.random() - 0.5) * 20;
                    positions[i3 + 2] = Math.sin(angle) * radius;
                }
                
                // Animate sizes based on alert type
                const alertPulse = Math.sin(time * (2 + particle.alertType) + particle.phase) * 0.3 + 0.7;
                sizes[i] = particle.originalSize * alertPulse;
            }
            
            this.alertParticleSystem.geometry.attributes.position.needsUpdate = true;
            this.alertParticleSystem.geometry.attributes.size.needsUpdate = true;
            
            // Update shader uniforms
            this.alertParticleSystem.material.uniforms.time.value = time;
            this.alertParticleSystem.material.uniforms.mousePos.value.set(this.mouseX, this.mouseY);
        }
        
        // Enhanced camera movement with SOC perspective
        this.camera.position.x += (this.mouseX * 8 - this.camera.position.x) * 0.03;
        this.camera.position.y += ((-this.mouseY * 3) + 5 - this.camera.position.y) * 0.03;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }

    onWindowResize() {
        const container = document.getElementById('soc-canvas').parentElement;
        
        this.camera.aspect = container.offsetWidth / container.offsetHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
}

// Enhanced SOC Effects System
class SOCEffects {
    static createSecurityGrid() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.05';
        
        document.body.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const gridSize = 30;
        let time = 0;
        
        function drawGrid() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#0078d4';
            ctx.lineWidth = 1;
            
            time += 0.02;
            
            // Draw animated grid
            for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
                ctx.globalAlpha = 0.3 + Math.sin(time + x * 0.01) * 0.2;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            
            for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
                ctx.globalAlpha = 0.3 + Math.sin(time + y * 0.01) * 0.2;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }
        
        setInterval(drawGrid, 50);
    }
    
    static addCursorSOCTrail() {
        const trail = [];
        const maxTrail = 15;
        
        document.addEventListener('mousemove', (e) => {
            trail.push({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            });
            
            if (trail.length > maxTrail) {
                trail.shift();
            }
            
            this.renderSOCTrail(trail);
        });
    }
    
    static renderSOCTrail(trail) {
        document.querySelectorAll('.soc-cursor-trail').forEach(el => el.remove());
        
        trail.forEach((point, index) => {
            const dot = document.createElement('div');
            dot.className = 'soc-cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: #0078d4;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${point.x - 3}px;
                top: ${point.y - 3}px;
                opacity: ${(index / trail.length) * 0.8};
                box-shadow: 0 0 15px #0078d4;
            `;
            
            document.body.appendChild(dot);
            
            gsap.to(dot, {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => dot.remove()
            });
        });
    }
}

// Initialize SOC Portfolio System
document.addEventListener('DOMContentLoaded', () => {
    // Start main SOC animation system
    const socPortfolio = new SOCPortfolio();
    
    // Add enhanced SOC effects
    SOCEffects.createSecurityGrid();
    SOCEffects.addCursorSOCTrail();
    
    // Loading animation with SOC theme
    gsap.to('body', {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
    });
    
    // Add periodic SOC alerts
    setInterval(() => {
        if (Math.random() > 0.92) {
            document.body.style.filter = 'hue-rotate(45deg) brightness(1.1)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 150);
        }
    }, 8000);
    
    // Add SOC status indicator
    const statusIndicator = document.createElement('div');
    statusIndicator.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 120, 212, 0.9);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        z-index: 1000;
        opacity: 0.8;
    `;
    statusIndicator.textContent = '🟢 SOC OPERATIONAL';
    document.body.appendChild(statusIndicator);
});

// Smooth loading
document.body.style.opacity = '0';

// Performance monitoring for SOC systems
let frameCount = 0;
let lastTime = performance.now();

function monitorSOCPerformance() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        if (fps < 30) {
            console.warn('SOC System Performance Warning: Low FPS detected:', fps);
        }
        
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(monitorSOCPerformance);
}

monitorSOCPerformance();