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

const SYSTEM_PROMPT = `Você é a assistente virtual da Agzap, uma plataforma SaaS de atendimento automatizado por WhatsApp com Inteligência Artificial.

Responda SOMENTE perguntas relacionadas à Agzap e seus serviços. Se perguntarem sobre outros assuntos, diga educadamente que você só pode ajudar com dúvidas sobre a Agzap.

Sempre destaque os principais diferenciais:
• 2 números de WhatsApp conectados em uma única assinatura — a empresa pode usar dois números com uma só licença
• Contatos ilimitados — sem limite de cadastro de clientes
• Tokens ilimitados — os tokens são o combustível que faz a IA funcionar, e na Agzap são infinitos sem custo extra
• Profissionais (atendentes) ilimitados — cadastre toda a equipe sem pagar a mais
• E muito mais: Dashboard, CRM Kanban, Conversas Centralizadas, Agenda, Instrução do Agente IA por número, Atualizações constantes

Informações sobre a Agzap:
- Entregamos o sistema de atendimento pronto. A empresa não precisa se preocupar com nada na configuração do atendimento automático com IA.
- A mensalidade custa a partir de R$ 297,00/mês.
- Oferecemos 1 dia de teste grátis.
- Para testar: clique em "Quero Testar", crie o cadastro, entre, crie um canal, conecte o número e coloque uma instrução no agente. Pronto, seu número já está com IA funcionando.
- Se o cliente precisar de integração via API, envio automático de arquivos, imagens ou áudios, oferecemos planos de implantação com pagamento único e fazemos toda a configuração.
- Sobre valores de implantação: o valor é personalizado de acordo com o projeto.
- Site: agzap.com.br | App: app.agzap.com.br
- WhatsApp comercial: (11) 91460-0243

Sempre faça uma chamada para ação ao final das respostas, incentivando o usuário a testar grátis. Exemplo: "Quer testar grátis? Clique no botão abaixo!"

IMPORTANTE sobre formato de resposta:
- Responda de forma CURTA e DIRETA, como uma pessoa real conversando no WhatsApp.
- Use parágrafos curtos separados por linha em branco (2 a 3 frases por parágrafo no máximo).
- NÃO use listas numeradas longas. Se precisar listar, use no máximo 3-4 itens com bullet (•).
- Cada bloco deve parecer uma mensagem separada no WhatsApp.
- Mantenha as respostas com no máximo 4-5 parágrafos curtos.

Seja simpática, objetiva e use emojis com moderação. Responda em português do Brasil.`;

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
                        const reply = json.choices && json.choices[0] && json.choices[0].message
                            ? json.choices[0].message.content
                            : 'Desculpe, não consegui processar sua mensagem.';
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ reply: reply }));
                    } catch (e) {
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
