# 🚀 DEPLOY GRÁTIS - ROTEIRO RÁPIDO

## Você vai precisar de:
- Conta GitHub (grátis)
- Conta Vercel (grátis)
- Conta Railway (grátis com $5/mês crédito)

---

## ✅ PASSO 1: GitHub

### 1. Criar repositório
1. Acesse [github.com/new](https://github.com/new)
2. Nome: `faceit-obs-widget`
3. Deixe **público**
4. Clique **Create repository**

### 2. Fazer push do código
```powershell
cd c:\Rede\SITE\v2\faceit-obs-widget
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USERNAME/faceit-obs-widget.git
git push -u origin main
```

**Copie essa URL que vai aparecer no seu GitHub (vamos usar depois)**

---

## ✅ PASSO 2: Railway (Backend)

1. Acesse [railway.app](https://railway.app)
2. Clique **GitHub Login**
3. **New Project** → **Deploy from GitHub repo**
4. Selecione seu repositório `faceit-obs-widget`
5. Configure:
   - **Root Directory:** `server`
   - Deixe as outras opções padrão
6. Clique **Deploy**
7. Aguarde até ficar verde ✅

### Copiar URL do Railway
- Seu app vai aparecer no dashboard
- Clique nele
- Vá em **Settings**
- Copie o **Domain** (algo como `https://seu-app.railway.app`)

**Anote essa URL - vamos usar no Vercel**

---

## ✅ PASSO 3: Vercel (Frontend)

1. Acesse [vercel.com](https://vercel.com)
2. Clique **Sign Up**
3. Escolha **GitHub**
4. Autorize e volte para Vercel
5. **Add New Project**
6. **Import Git Repository**
7. Encontre seu repositório `faceit-obs-widget`
8. Configure:
   - **Framework:** Vite
   - **Root Directory:** `client`

### Adicionar variável de ambiente
1. Vá em **Environment Variables**
2. Adicione:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://seu-app.railway.app` (URL do Railway que você anotou)
3. Clique **Add**
4. **Deploy**

Aguarde a compilação ficar pronta ✅

### Copiar URL do Vercel
Vercel vai gerar uma URL tipo: `https://faceit-obs-widget.vercel.app`

---

## 🎮 TESTAR NO OBS

1. **OBS** → **Cena** → **+** (novo item)
2. Escolha **Browser Source**
3. **URL:** `https://faceit-obs-widget.vercel.app` (sua URL Vercel)
4. **Largura:** 520
5. **Altura:** 700
6. **OK**

✅ Pronto! Seu widget está online!

---

## 🔄 Atualizar o código

Qualquer mudança no código:
```powershell
git add .
git commit -m "Descrição da mudança"
git push origin main
```

✅ **Vercel** e **Railway** deployam automaticamente!

---

## ❓ Dúvidas Comuns

### "Widget em branco"
- Verifique se a URL do Vercel funciona no navegador
- Checque se a URL do Railway está correta em Vercel

### "Erro ao conectar API"
- Vercel → Settings → Environment Variables
- Verifique se `VITE_API_URL` está certo

### "Railway está lento"
- Railway entra em sono depois de 7 dias
- Totalmente normal, quando você acessa acorda automaticamente

---

## 💰 Quanto custa?

**ZERO REAIS** 🎉

- ✅ GitHub: Grátis
- ✅ Vercel: Grátis
- ✅ Railway: Grátis ($5/mês crédito)

---

**Pronto para deploy? Comece pelo PASSO 1! 🚀**
