# FACEIT OBS Widget - Deploy Gratuito

## 🎯 Stack Final (100% Grátis)

- **Frontend:** Vercel (React/Vite) - Grátis
- **Backend:** Railway (Node.js) - Grátis com $5/mês de crédito
- **Versionamento:** GitHub (Grátis)

---

## 📋 PASSO A PASSO COMPLETO

### **PASSO 1: Preparar o GitHub**

#### 1.1 - Criar repositório no GitHub
1. Acesse [github.com/new](https://github.com/new)
2. Nome: `faceit-obs-widget`
3. Descrição: `Widget OBS para exibir stats FACEIT em tempo real`
4. Deixe **público** (necessário para Vercel/Railway grátis)
5. **Create repository**

#### 1.2 - Fazer commit local
```powershell
cd c:\Rede\SITE\v2\faceit-obs-widget
git init
git add .
git commit -m "Initial commit: FACEIT OBS Widget"
git branch -M main
git remote add origin https://github.com/SEU_USERNAME/faceit-obs-widget.git
git push -u origin main
```

---

### **PASSO 2: Deploy Backend no Railway (Grátis)**

#### 2.1 - Criar conta Railway
1. Acesse [railway.app](https://railway.app)
2. Clique em **GitHub Login**
3. Autorize o acesso

#### 2.2 - Conectar repositório
1. Dashboard → **New Project**
2. **Deploy from GitHub repo**
3. Selecione `faceit-obs-widget`
4. Configure:
   - **Root Directory:** `server`
   - **Add variables:** (deixe vazio por enquanto)

#### 2.3 - Confirmar deploy
1. Railway faz deploy automático
2. Aguarde até ver ✅ próximo ao seu app
3. Clique no app → **Settings** → copie a URL (exemplo: `https://faceit-widget-api-production.up.railway.app`)

#### 2.4 - Qual Railway oferece?
- ✅ Grátis: $5/mês de crédito (suficiente)
- ✅ Deploy automático via GitHub
- ✅ Banco de dados (não usamos, mas tem)
- ⚠️ Depois de 7 dias inativo, pode dormir

---

### **PASSO 3: Deploy Frontend no Vercel (100% Grátis)**

#### 3.1 - Criar conta Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique **Sign Up**
3. Escolha **GitHub** → Autorize

#### 3.2 - Deploy automático
1. Dashboard Vercel → **Add New Project**
2. **Import Git Repository**
3. Selecione `faceit-obs-widget`
4. Configure:
   - **Framework:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### 3.3 - Variáveis de Ambiente
1. **Environment Variables:**
   - Nome: `VITE_API_URL`
   - Valor: `https://faceit-widget-api-production.up.railway.app` (URL do Railway)
2. **Deploy**

#### 3.4 - Copiar URL
Após deploy, Vercel gera uma URL pública (exemplo: `https://faceit-obs-widget.vercel.app`)

---

### **PASSO 4: Configurar Auto-Deploy**

Qualquer push para GitHub = deploy automático (Vercel + Railway)

```powershell
# Fazer mudanças no código
git add .
git commit -m "Descrição das mudanças"
git push origin main
# ✅ Vercel + Railway deployam automaticamente
```

---

## 🎮 USAR NO OBS

1. **OBS:** Cenas → Novo item → **Browser Source**
2. **URL:** `https://faceit-obs-widget.vercel.app` (sua URL Vercel)
3. **Resolução:**
   - Largura: 520
   - Altura: 700
4. **OK**

---

## 💰 CUSTO MENSAL

| Serviço | Custo |
|---------|-------|
| GitHub | GRÁTIS |
| Vercel | GRÁTIS |
| Railway | GRÁTIS ($5/mês crédito) |
| **Total** | **GRÁTIS** ✅ |

---

## 🔐 Checklist Final

- [ ] Repositório GitHub criado
- [ ] `.gitignore` configurado corretamente
- [ ] Backend deployado no Railway
- [ ] Frontend deployado no Vercel
- [ ] `VITE_API_URL` configurada no Vercel
- [ ] Auto-refresh testado
- [ ] Widget funcionando no OBS

---

## 🚨 Troubleshooting

### Error: "Não consegue conectar com API"
```powershell
# Verifique se a URL do Railway está correta
# Vercel → Settings → Environment Variables → VITE_API_URL
```

### Widget em branco no OBS
```powershell
# Verifique no navegador: https://seu-vercel-url.vercel.app
# Se funcionar no navegador, problema é no OBS Browser Source
```

### Railway está lento (dorma)
Railway entra em sleep depois de 7 dias sem uso. Solução:
- Fazer requisição ao `/api/health` a cada 6 dias
- Ou usar **Railway Pro** ($20/mês - não recomendado para você)

---

## 📱 URLs Importantes

| Serviço | Link |
|---------|------|
| GitHub | https://github.com/seu-username/faceit-obs-widget |
| Vercel | https://vercel.com/dashboard |
| Railway | https://railway.app |
| Widget | https://seu-vercel-url.vercel.app |
| API | https://seu-railway-url.railway.app |

---

## ✨ Próximos passos (Opcional)

1. **Domain customizada:** Railway/Vercel oferecem
2. **Webhook FACEIT:** Atualizar em tempo real (pago)
3. **Banco de dados:** Railway oferece PostgreSQL grátis

---

**Seu widget está 100% grátis e automatizado! 🎉**
