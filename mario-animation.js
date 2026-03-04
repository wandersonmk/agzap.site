document.addEventListener('DOMContentLoaded', () => {
    const marioLuigi = document.getElementById('mario-luigi');
    const shadow = document.querySelector('.mario-shadow');
    const container = document.querySelector('.mario-container');

    let isJumping = false;
    
    document.addEventListener('mousemove', (e) => {
        if (isJumping) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);
        
        // Calcular a distância do mouse ao centro
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Limitar a rotação baseada na distância
        const maxRotation = 15;
        const maxDistance = 300;
        const rotationX = Math.min(maxRotation, (deltaY / maxDistance) * maxRotation);
        const rotationY = Math.min(maxRotation, (deltaX / maxDistance) * maxRotation);
        
        // Aplicar transformação
        marioLuigi.style.transform = `
            rotateX(${-rotationX}deg) 
            rotateY(${rotationY}deg)
            scale(1.05)
        `;
        
        // Ajustar sombra
        shadow.style.transform = `
            translateX(-50%) 
            scale(${1 + Math.abs(rotationX) / 50})
            rotateX(${rotationX}deg)
        `;
        shadow.style.opacity = 1 - (Math.abs(rotationX) / 45);
    });

    // Efeito de pulo ao clicar
    container.addEventListener('click', () => {
        if (isJumping) return;
        isJumping = true;

        marioLuigi.style.transform = `
            translateY(-50px) 
            scale(1.1) 
            rotateX(-20deg)
        `;
        shadow.style.transform = 'translateX(-50%) scale(1.2)';
        shadow.style.opacity = '0.5';

        setTimeout(() => {
            marioLuigi.style.transform = 'none';
            shadow.style.transform = 'translateX(-50%) scale(1)';
            shadow.style.opacity = '1';
            
            setTimeout(() => {
                isJumping = false;
            }, 300);
        }, 300);
    });

    // Resetar quando o mouse sai
    container.addEventListener('mouseleave', () => {
        if (!isJumping) {
            marioLuigi.style.transform = 'none';
            shadow.style.transform = 'translateX(-50%) scale(1)';
            shadow.style.opacity = '1';
        }
    });
});
