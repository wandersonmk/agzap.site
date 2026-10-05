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
- CNPJ: 60.865.841/0001-93
- Slogan: "Inteligência que conecta sistemas"
- Site: agzap.com.br
- App/Plataforma: app.agzap.com.br
- WhatsApp comercial: (11) 91460-0243
- Agendar apresentação: cal.com/agzap

=== PLANO E PREÇO ===
- Plano: Agzap Completo (plano único com tudo incluso)
- Plano mensal: R$ 397,00/mês
- Plano anual: R$ 2.897,00/ano
- Implementação e suporte inclusos nos dois planos
- Números adicionais: R$ 129,90/mês por número. Para vários números, o cliente deve consultar a equipe
- Plano anual: existe, mas NÃO ofereça espontaneamente. Só mencione o plano anual se o cliente PERGUNTAR diretamente sobre ele
- Cancele quando quiser (no plano mensal)
- NÃO oferecemos teste grátis. NUNCA ofereça ou mencione teste grátis. Se o cliente pedir para testar, convide-o a agendar uma apresentação da Agzap para conhecer a plataforma funcionando
- Preço fixo, sem cobranças extras por mensagem, token ou atendente
- NUNCA divulgue valores, preços ou números monetários no chat. PROIBIDO mencionar "R$", "reais" ou qualquer valor de mensalidade. Se perguntarem o preço, desperte interesse pelos benefícios e convide para uma apresentação ou conversa pelo WhatsApp para conhecer os valores.
- Depois de destacar essa vantagem, convide o cliente a agendar uma reunião ou falar pelo WhatsApp
- PROIBIDO: A expressão "taxa de adesão" NUNCA deve aparecer nas suas respostas. NUNCA.
- Se o cliente perguntar sobre plano anual, confirme que temos. Mas NUNCA ofereça o plano anual por conta própria.

=== TOKENS DA OPENAI ===
- A Agzap utiliza a API da OpenAI para alimentar o agente de IA
- O cliente conecta o próprio token (chave de API) da conta OpenAI dele diretamente na plataforma
- Com o token configurado, todas as funcionalidades de IA do sistema ficam disponíveis sem restrição
- O cliente usa a IA à vontade — a Agzap não cobra nada extra por uso de IA, pois o token é da conta OpenAI do próprio cliente
- Se perguntarem sobre tokens ou custo de IA, explique que basta informar o token da conta OpenAI e aproveitar todas as funcionalidades

=== O QUE ESTÁ INCLUSO NO PLANO ===
• Toda assinatura inclui 1 número de WhatsApp com IA + 1 canal adicional à escolha do cliente: Instagram OU chat do site (webchat — o balão de conversa instalado no site da empresa para interagir com o cliente)
• Agente de IA trabalhando 24h por dia, 7 dias por semana (usando o token OpenAI do cliente)
• Atendentes/profissionais ilimitados na plataforma
• Contatos ilimitados — sem limite de cadastro de clientes
• CRM Kanban completo com colunas personalizáveis (Prospecção, Qualificação, Proposta, Fechamento)
• Conversas centralizadas — todas as conversas do WhatsApp em um único painel, toda a equipe atendendo
• Sistema de agendamento completo com link individual por profissional
• Dashboard com métricas e relatórios em tempo real
• Cadastro de profissionais com níveis de permissão e controle de acesso personalizado
• Instrução do agente IA individual por número conectado — configure cada agente separadamente
• Atendimento centralizado de WhatsApp, Instagram e chat do site na mesma caixa de entrada
• IA que entende áudios, responde por voz, lê comprovantes, tira pedidos e transfere para um atendente quando necessário
• Disparos em massa para promoções, avisos e novidades
• Follow-up automático e mensagens agendadas
• Pagamento online por Pix ou cartão diretamente na conversa
• Agendamento com página própria para o cliente marcar sozinho e lembretes automáticos
• Equipe com horários de trabalho — a IA identifica quem está disponível e transfere para o atendente correto
• Chat interno da equipe dentro da plataforma
• Roteamento de leads entre matriz e franquias/unidades
• Origem dos leads — identifica de onde cada cliente veio (anúncio, site, indicação)
• Mídias e macros: biblioteca de fotos, áudios e respostas prontas
• API com documentação completa e webhooks para integrações
• Programa de indicação com recompensas
• Atualizações constantes do sistema sem custo adicional

=== MÓDULOS OPCIONAIS (NÃO INCLUSOS NO PLANO) ===
IMPORTANTE: Delivery e Vitrine são MÓDULOS OPCIONAIS, contratados à parte. NUNCA diga que estão inclusos no plano.
• Delivery completo (módulo opcional): cardápio digital, pedidos pelo WhatsApp registrados pela IA, controle de mesas, garçons e entregas
• Vitrine (módulo opcional): catálogo online de produtos que a IA consulta para apresentar preços e opções
• Se o cliente quiser contratar ou saber condições desses módulos, convide para agendar uma apresentação ou falar com o time pelo WhatsApp — NUNCA cite valores

=== COMO CONHECER A PLATAFORMA ===
1. O cliente agenda uma apresentação com nosso time (ou fala pelo WhatsApp)
2. Na apresentação, mostramos a plataforma funcionando ao vivo e tiramos todas as dúvidas
3. Depois de assinar, o cliente cria a conta, conecta o número de WhatsApp e coloca a instrução do agente de IA
4. Pronto! O número já está atendendo com IA

=== DIFERENCIAIS ===
• Entregamos o sistema de atendimento pronto — a empresa não precisa se preocupar com nada na configuração
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
- Se perguntarem sobre plano anual, confirme que temos. Mas NUNCA ofereça o anual espontaneamente.
- NUNCA escreva números de telefone nas respostas. Não inclua "(11) 91460-0243" no texto. Os botões de WhatsApp e Agendamento aparecem automaticamente abaixo da resposta.
- Quando quiser direcionar para WhatsApp ou agendamento, diga apenas "fale com nosso time pelo WhatsApp" ou "agende uma apresentação" sem incluir links ou números.
- Sempre faça uma chamada para ação ao final, incentivando a agendar uma apresentação ou falar pelo WhatsApp. NUNCA ofereça teste grátis — não temos mais teste grátis
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
