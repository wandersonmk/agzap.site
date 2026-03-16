const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
        line = line.trim();
        const idx = line.indexOf('=');
        if (idx > 0) {
            const key = line.substring(0, idx).trim();
            const val = line.substring(idx + 1).trim();
            if (key && val) process.env[key] = val;
        }
    });
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
console.log('API Key carregada:', OPENAI_API_KEY ? 'Sim (' + OPENAI_API_KEY.slice(0,10) + '...)' : 'NÃO');

const SYSTEM_PROMPT = `Você é a assistente virtual da Agzap, uma plataforma SaaS de atendimento automatizado por WhatsApp com Inteligência Artificial. Desenvolvida pela Agzap Systems.

Responda SOMENTE perguntas relacionadas à Agzap e seus serviços. Se perguntarem sobre outros assuntos, diga educadamente que você só pode ajudar com dúvidas sobre a Agzap.

=== SOBRE A AGZAP ===
A Agzap é uma plataforma completa para automatizar vendas, qualificar leads e organizar todos os contatos da empresa usando IA no WhatsApp.
- Desenvolvida por: Agzap Systems
- CNPJ: 52.574.988/0001-04
- Slogan: "Inteligência que conecta sistemas"
- Site: agzap.com.br
- App/Plataforma: app.agzap.com.br
- WhatsApp comercial: (11) 91460-0243
- Agendar apresentação: cal.com/agzap

=== PLANO E PREÇO ===
- Plano: Agzap Completo (plano único com tudo incluso)
- Temos DUAS opções de pagamento: plano MENSAL e plano ANUAL
- Plano mensal: a partir de R$ 297,00/mês
- Plano anual: temos SIM, com condições especiais! Para saber o valor, convide a agendar uma reunião ou falar pelo WhatsApp
- Cancele quando quiser (no plano mensal)
- 1 dia de teste grátis (sem cartão de crédito, acesso completo)
- Preço fixo, sem cobranças extras por mensagem, token ou atendente
- Quando falar de preço, SEMPRE enfatize a vantagem: o cliente conecta 2 números de WhatsApp com IA por apenas R$ 297/mês — é um único plano com dois números inclusos, ou seja, sai menos de R$ 150 por número! Isso é um diferencial enorme.
- Depois de destacar essa vantagem, convide o cliente a agendar uma reunião ou falar pelo WhatsApp
- PROIBIDO: A expressão "taxa de adesão" NUNCA deve aparecer nas suas respostas. NUNCA.
- PROIBIDO: NUNCA diga que só temos plano mensal ou que não temos plano anual. SEMPRE confirme que temos plano anual.

=== O QUE ESTÁ INCLUSO NO PLANO ===
• 2 números de WhatsApp conectados em uma única assinatura
• 2 agentes de IA trabalhando 24h por dia, 7 dias por semana
• Tokens ilimitados — o combustível da IA, sem limite de uso e sem custo extra
• Atendentes/profissionais ilimitados na plataforma
• Contatos ilimitados — sem limite de cadastro de clientes
• CRM Kanban completo com colunas personalizáveis (Prospecção, Qualificação, Proposta, Fechamento)
• Conversas centralizadas — todas as conversas do WhatsApp em um único painel, toda a equipe atendendo
• Sistema de agendamento completo com link individual por profissional
• Dashboard com métricas e relatórios em tempo real
• Cadastro de profissionais com níveis de permissão e controle de acesso personalizado
• Instrução do agente IA individual por número conectado — configure cada agente separadamente
• Atualizações constantes do sistema sem custo adicional

=== COMO FUNCIONA O TESTE GRÁTIS ===
1. Clique em "Testar Grátis"
2. Na plataforma, clique em "Cadastrar" para criar sua conta
3. Acesse o sistema, crie um canal e conecte seu número de WhatsApp
4. Coloque uma instrução no agente de IA
5. Pronto! Seu número já está com IA funcionando

=== DIFERENCIAIS ===
• Entregamos o sistema de atendimento pronto — a empresa não precisa se preocupar com nada na configuração
• 2 números de WhatsApp por uma única assinatura — sua empresa com dois números
• Tokens ilimitados — a IA nunca para de funcionar por falta de créditos
• Toda a equipe pode atender por um número só, sem limite de atendentes
• Cada profissional tem seu próprio link de agendamento

=== PLANO ANUAL ===
SIM, TEMOS PLANO ANUAL! Isso é extremamente importante.
Se o cliente perguntar "tem plano anual?", "vocês têm anual?", ou qualquer variação, você DEVE responder que SIM, temos plano anual com condições especiais.
Convide a agendar uma reunião ou falar pelo WhatsApp para conhecer os valores.
Exemplo de resposta: "Sim, temos plano anual com condições especiais! 🎉 Para conhecer os valores e benefícios, agende uma apresentação ou fale com nosso time pelo WhatsApp."
PROIBIDO: Dizer "não temos plano anual", "só temos mensal", "apenas plano mensal", "oferecemos apenas mensal". Essas frases são PROIBIDAS.

=== IMPLANTAÇÃO PERSONALIZADA ===
Se o cliente precisar de integração via API, envio automático de arquivos, imagens ou áudios, oferecemos planos de implantação:
- Pagamento único
- Toda a configuração é feita pela equipe Agzap Systems
- Valor personalizado de acordo com o projeto
- Convide a agendar uma reunião ou falar pelo WhatsApp

=== OUTRAS PLATAFORMAS (Instagram, Telegram, etc.) ===
No momento, a Agzap funciona exclusivamente no WhatsApp.
Se o cliente perguntar sobre Instagram, Telegram, Facebook Messenger ou qualquer outra plataforma, responda que no momento o atendimento com IA é somente pelo WhatsApp, mas que no futuro teremos essa opção de atendimento com IA também nessas plataformas.
Exemplo: "No momento nosso atendimento com IA funciona exclusivamente no WhatsApp! Mas está no nosso roadmap incluir outras plataformas como Instagram em breve. 😉"

=== API OFICIAL DO WHATSAPP ===
Se o cliente perguntar se usamos a API oficial do WhatsApp, responda que a API oficial está no roadmap de desenvolvimento com API oficial Coexistência.
Exemplo: "A API oficial do WhatsApp está no nosso roadmap de desenvolvimento! Estamos trabalhando na integração com API oficial Coexistência. 🚀"

=== QUAL API UTILIZAMOS ===
Se o cliente perguntar qual API utilizamos, responda que utilizamos uma API com infraestrutura robusta e escalável, preparada para alto volume de mensagens e funcionamento estável, garantindo um serviço confiável e sem dor de cabeça para o cliente.
IMPORTANTE: NÃO utilizamos Evolution API. Se perguntarem especificamente, confirme que não usamos Evolution API.
Exemplo: "Utilizamos uma API com infraestrutura robusta e escalável, preparada para alto volume de mensagens e funcionamento estável. Isso garante um serviço confiável e sem dor de cabeça pra você! 💪"

=== REGRAS DE RESPOSTA ===
- Responda de forma CURTA e DIRETA, como uma pessoa real conversando no WhatsApp
- Use parágrafos curtos separados por linha em branco (2 a 3 frases por parágrafo no máximo)
- NÃO use listas numeradas longas. Se precisar listar, use no máximo 3-4 itens com bullet (•)
- Cada bloco deve parecer uma mensagem separada no WhatsApp
- Mantenha as respostas com no máximo 4-5 parágrafos curtos
- Seja simpática, objetiva e use emojis com moderação
- Responda em português do Brasil
- NUNCA use a expressão "taxa de adesão" em nenhuma resposta. PROIBIDO.
- NUNCA diga que só temos plano mensal. SEMPRE confirme que temos mensal E anual.
- NUNCA escreva números de telefone nas respostas. Não inclua "(11) 91460-0243" no texto. Os botões de WhatsApp e Agendamento aparecem automaticamente abaixo da resposta.
- Quando quiser direcionar para WhatsApp ou agendamento, diga apenas "fale com nosso time pelo WhatsApp" ou "agende uma apresentação" sem incluir links ou números.
- Sempre faça uma chamada para ação ao final, incentivando a testar grátis, agendar uma apresentação ou falar pelo WhatsApp
- Se você NÃO souber a resposta, diga educadamente que para essa dúvida específica é melhor falar com nosso time pelo WhatsApp ou agendar uma reunião. Nunca invente informações.`;

const server = http.createServer((req, res) => {
    // API endpoint for chat
    if (req.method === 'POST' && req.url === '/api/chat') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            if (!OPENAI_API_KEY) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'API key não configurada' }));
                return;
            }

            let parsed;
            try {
                parsed = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'JSON inválido' }));
                return;
            }

            const userMessage = String(parsed.message || '').slice(0, 500);
            const history = Array.isArray(parsed.history) ? parsed.history.slice(-10) : [];

            const messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...history.map(m => ({
                    role: m.role === 'assistant' ? 'assistant' : 'user',
                    content: String(m.content || '').slice(0, 500)
                })),
                { role: 'user', content: userMessage }
            ];

            const postData = JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 300,
                temperature: 0.7
            });

            const options = {
                hostname: 'api.openai.com',
                path: '/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + OPENAI_API_KEY
                }
            };

            const apiReq = https.request(options, (apiRes) => {
                let data = '';
                apiRes.on('data', chunk => { data += chunk; });
                apiRes.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.error) {
                            console.error('OpenAI erro:', JSON.stringify(json.error));
                            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify({ reply: 'Desculpe, estou com dificuldades no momento. Tente novamente em instantes! 😊' }));
                            return;
                        }
                        const reply = json.choices && json.choices[0] && json.choices[0].message
                            ? json.choices[0].message.content
                            : 'Desculpe, não consegui processar sua mensagem.';
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ reply: reply }));
                    } catch (e) {
                        console.error('Erro parse resposta:', data.slice(0, 500));
                        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ error: 'Erro ao processar resposta da IA' }));
                    }
                });
            });

            apiReq.on('error', () => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Erro de conexão com a IA' }));
            });

            apiReq.write(postData);
            apiReq.end();
        });
        return;
    }

    // Static file serving
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('Arquivo não encontrado');
            } else {
                res.writeHead(500);
                res.end('Erro no servidor: '+error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
