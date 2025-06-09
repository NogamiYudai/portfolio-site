document.addEventListener('DOMContentLoaded', function() {
    
    // --- 既存のタイピングアニメーション ---
    // if (document.querySelector('.typing')) {
    //     new Typed('.typing', {
    //         strings: ['Unity Developer', 'Friendly Mentor', 'CG Engineer'],
    //         typeSpeed: 70,
    //         backSpeed: 50,
    //         loop: true,
    //         startDelay: 1000,
    //         backDelay: 2000,
    //     });
    // }
     const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('loaded');
        }, 500);
    }

    // --- 既存のスクロールフェードイン ---
    const faders = document.querySelectorAll('.fade-in');
    if (faders.length > 0) {
        const appearOptions = {
            threshold: 0.2,
            rootMargin: "0px 0px -50px 0px"
        };
        const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('visible');
                    appearOnScroll.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });
    }

    // --- 色相が滑らかに変化する背景アニメーション ---
    const hero = document.querySelector('.hero');
    if (hero) {
        let hue = 200; 

        function animateGradient() {
            hue = (hue + 0.2) % 360; 
            const color1 = `hsl(${hue}, 80%, 65%)`; 
            const color2 = `hsl(${(hue + 60) % 360}, 80%, 60%)`;
            hero.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
            requestAnimationFrame(animateGradient);
        }
        // グラデーションアニメーションを開始
        animateGradient();
    }

    // --- ★★★ 新しいポリゴンウェーブアニメーション ★★★ ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        const rows = 50; 
        const cols = 30; 
        const waveSpeed = 0.005;
        let points = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            points = [];
            for (let z = 0; z <= rows; z++) {
                for (let x = 0; x <= cols; x++) {
                    points.push({
                        x: (x - cols / 2) * 80,
                        y: 0,
                        z: z * 20
                    });
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            let time = performance.now() * waveSpeed;

            points.forEach(p => {
                p.z -= 1;
                if (p.z < 0) {
                    p.z = rows * 20;
                }
                const wave1 = Math.sin(p.x * 0.01 + p.z * 0.02 + time) * 20;
                const wave2 = Math.sin(p.x * 0.02 + p.z * 0.05 + time * 0.5) * 15;
                p.y = wave1 + wave2;
            });

            // ★ 修正点: 描画の前提を崩すソート処理を削除し、より安定な描画ループに変更
            for (let z = 0; z < rows; z++) {
                for (let x = 0; x < cols; x++) {
                    const p1Index = z * (cols + 1) + x;
                    const p2Index = p1Index + 1;
                    const p3Index = p1Index + cols + 1;
                    const p4Index = p1Index + cols + 2;

                    if (p4Index < points.length) {
                        const p1 = points[p1Index];
                        const p2 = points[p2Index];
                        const p3 = points[p3Index];
                        const p4 = points[p4Index];

                        const projectedP1 = project(p1);
                        const projectedP2 = project(p2);
                        const projectedP3 = project(p3);
                        const projectedP4 = project(p4);
    
                        const avgY = (p1.y + p2.y + p3.y) / 3;
                        const colorHue = (hue + avgY * 2) % 360;
                        ctx.fillStyle = `hsla(${colorHue}, 80%, 60%, 0.3)`;
                        ctx.strokeStyle = `hsla(${colorHue}, 80%, 70%, 0.5)`;
                        
                        ctx.beginPath();
                        ctx.moveTo(projectedP1.x, projectedP1.y);
                        ctx.lineTo(projectedP2.x, projectedP2.y);
                        ctx.lineTo(projectedP3.x, projectedP3.y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
    
                        ctx.beginPath();
                        ctx.moveTo(projectedP2.x, projectedP2.y);
                        ctx.lineTo(projectedP4.x, projectedP4.y);
                        ctx.lineTo(projectedP3.x, projectedP3.y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        
        function project(p) {
            const fov = 400;
            const scale = fov / (fov + p.z);
            return {
                x: p.x * scale + width / 2,
                y: p.y * scale + height / 2,
            };
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }
});
