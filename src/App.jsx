/**
 * CodeExam Pro — Plateforme d'évaluation de programmation
 * App.jsx — Single-file React application
 * Compatible: React 18+, Vite
 *
 * CORRECTIONS :
 * 1. Suppression des marges/paddings horizontaux parasites → page colle au bord gauche
 * 2. Ajout d'un reset CSS global (margin:0, padding:0 sur html/body) via <style> injecté une seule fois
 * 3. Coloration syntaxique intégrée (pur JS/CSS, sans dépendance) dans CodeEditor
 * 4. Scroll horizontal corrigé : overflow-x:hidden sur les conteneurs racines
 * 5. Correction du double-scroll dans TeacherDashboard (div imbriquée inutile retirée)
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { banqueQuestions } from "./banque_question.js";

// ─── CHARGEMENT KATEX (script dynamique, une seule fois) ─────────────────────
let katexLoaded = false;
let katexLoadPromise = null;

const loadKaTeX = () => {
  if (katexLoaded) return Promise.resolve();
  if (katexLoadPromise) return katexLoadPromise;
  katexLoadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js";
    script.crossOrigin = "anonymous";
    script.onload = () => { katexLoaded = true; resolve(); };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
  return katexLoadPromise;
};

// ─── COMPOSANT MATHTEXT — rendu LaTeX inline et display ──────────────────────
const MathText = ({ text }) => {
  const [ready, setReady] = useState(katexLoaded);

  useEffect(() => {
    if (!katexLoaded) {
      loadKaTeX().then(() => setReady(true));
    }
  }, []);

  if (!text) return null;

  const segments = [];
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith("$$")) {
      segments.push({ type: "display", content: raw.slice(2, -2).trim() });
    } else {
      segments.push({ type: "inline", content: raw.slice(1, -1).trim() });
    }
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return (
    <div className="enonce-container">
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return seg.content.split("\n").map((line, li, arr) => (
            <React.Fragment key={`${i}-${li}`}>
              {line}
              {li < arr.length - 1 && <br />}
            </React.Fragment>
          ));
        }
        if (ready && window.katex) {
          try {
            const html = window.katex.renderToString(seg.content, {
              displayMode: seg.type === "display",
              throwOnError: false,
              strict: false,
            });
            return (
              <span
                key={i}
                className={seg.type === "display" ? "math-block" : "math-inline"}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch { /* repli */ }
        }
        return (
          <code key={i} style={{
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 4, padding: "1px 5px", fontSize: "0.92em",
            fontFamily: "JetBrains Mono, monospace", color: "#a78bfa",
          }}>
            {seg.type === "display" ? `$$${seg.content}$$` : `$${seg.content}$`}
          </code>
        );
      })}
    </div>
  );
};

// ─── CONSTANTES ─────────────────────────────────────────────────────────────
const EXAM_DURATION_MINUTES = 90;
const AUTOSAVE_INTERVAL_MS = 5000;
const TEACHER_PASSWORD = "prof@2024";
const STORAGE_KEY = "codeexam_pro_v2";
const MAX_TAB_VIOLATIONS = 3;
// Nombre de questions tirées au sort pour chaque examen.
const QUESTIONS_PER_EXAM = 20;

// ─── RESET CSS GLOBAL (injecté une seule fois) ───────────────────────────────
const GlobalStyle = () => (
  <>
    {/* KaTeX CSS */}
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"
      crossOrigin="anonymous"
    />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;1,400&family=Nunito:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap');
      html, body, #root {
        margin: 0 !important;
        padding: 0 !important;
        width: 100%;
        max-width: 100vw;
        overflow-x: hidden;
        box-sizing: border-box;
        font-family: 'Nunito', 'Inter', sans-serif;
      }
      *, *::before, *::after { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #0a0a16; }
      ::-webkit-scrollbar-thumb { background: #2d2d4a; border-radius: 3px; }
      @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
      @keyframes slideDown { from { opacity:0; transform:translateX(-50%) translateY(-10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
      @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; }

      /* ── KaTeX overrides pour thème sombre ── */
      .katex { font-size: 1.05em; color: #c4b5fd; }
      .katex-display { margin: 12px 0; overflow-x: auto; overflow-y: hidden; }
      .katex-display > .katex { color: #a78bfa; }

      /* ── Énoncé — mise en forme professionnelle ── */
      .enonce-container {
        font-family: 'Nunito', sans-serif;
        font-size: 15.5px;
        line-height: 1.75;
        letter-spacing: 0.1px;
        color: #d4dbe6;
        word-break: break-word;
      }
      .enonce-container p {
        margin: 0 0 12px 0;
      }
      .enonce-container br {
        content: "";
        display: block;
        margin-top: 10px;
      }
      .enonce-container .math-block {
        display: block;
        background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06));
        border: 1px solid rgba(99,102,241,0.25);
        border-left: 3px solid #6366f1;
        border-radius: 10px;
        padding: 14px 18px;
        margin: 16px 0;
        text-align: center;
        overflow-x: auto;
      }
      .enonce-container .math-inline {
        display: inline;
        padding: 1px 3px;
      }

      /* ── Grille question / éditeur — responsive ── */
      .question-grid {
        display: grid;
        grid-template-columns: 1fr 1.6fr;
        gap: 16px;
      }
      .enonce-box {
        padding: 20px 22px;
      }
      .question-card {
        padding: 22px 24px;
      }
      @media (max-width: 900px) {
        .question-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
      }
      @media (max-width: 640px) {
        .enonce-container {
          font-size: 14.5px;
          line-height: 1.65;
        }
        .enonce-box {
          padding: 16px 16px;
        }
        .question-card {
          padding: 16px 18px;
        }
      }
    `}</style>
  </>
);

// ─── UTILITAIRES ────────────────────────────────────────────────────────────
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }));
  } catch { /* silent */ }
};

// ─── SÉLECTION ALÉATOIRE DES QUESTIONS ──────────────────────────────────────
/**
 * Mélange Fisher–Yates : renvoie un NOUVEAU tableau mélangé,
 * sans jamais modifier le tableau d'origine (important car `banqueQuestions`
 * est partagé par toute l'application).
 */
const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Sélectionne aléatoirement `count` questions uniques dans `bank`.
 * - Aucune question ne peut apparaître deux fois (tirage sans remise).
 * - Si `bank` contient moins de `count` questions, toutes sont renvoyées
 *   (mélangées).
 */
const selectRandomQuestions = (bank, count = QUESTIONS_PER_EXAM) => {
  const shuffled = shuffleArray(bank);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Reconstruit une liste de questions à partir d'une liste d'identifiants,
 * en conservant l'ordre des identifiants. Permet de restaurer EXACTEMENT
 * les mêmes questions (mêmes objets, même ordre) sans les ré-stocker en
 * intégralité dans le localStorage : on n'y sauvegarde que les ids.
 */
const getQuestionsByIds = (ids, bank = banqueQuestions) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const byId = new Map(bank.map(q => [q.id, q]));
  return ids.map(id => byId.get(id)).filter(Boolean);
};

/**
 * Détermine la liste des questions effectivement posées lors d'un examen,
 * par ordre de priorité :
 *  1) la liste de questions explicite (ex: résultat fraîchement soumis) ;
 *  2) reconstruction à partir des `questionIds` sauvegardés ;
 *  3) repli (anciennes données / données de démonstration) : les 20
 *     premières questions de la banque, pour conserver un affichage cohérent.
 */
const resolveExamQuestions = ({ questions, questionIds } = {}) => {
  if (Array.isArray(questions) && questions.length > 0) return questions;
  const restored = getQuestionsByIds(questionIds);
  if (restored.length > 0) return restored;
  return banqueQuestions.slice(0, QUESTIONS_PER_EXAM);
};

const getLangColor = (lang) => ({
  python: "#3B82F6", java: "#F59E0B", c: "#8B5CF6", cpp: "#EC4899", javascript: "#10B981"
})[lang] || "#6B7280";

const getLangLabel = (lang) => ({
  python: "Python", java: "Java", c: "C", cpp: "C++", javascript: "JavaScript"
})[lang] || lang;

const getTypeLabel = (type) => ({
  ecriture: "✍️ Écriture libre", completion: "🧩 Compléter le code", correction: "🔧 Corriger les erreurs"
})[type] || type;

// ─── COLORATION SYNTAXIQUE ──────────────────────────────────────────────────
/**
 * Tokenizer léger multi-langage.
 * Retourne un tableau de { text, type } pour colorisation dans un <pre>.
 */
const KEYWORDS = {
  python: ["False","None","True","and","as","assert","async","await","break","class","continue",
    "def","del","elif","else","except","finally","for","from","global","if","import","in",
    "is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"],
  java: ["abstract","assert","boolean","break","byte","case","catch","char","class","const",
    "continue","default","do","double","else","enum","extends","final","finally","float",
    "for","goto","if","implements","import","instanceof","int","interface","long","native",
    "new","null","package","private","protected","public","return","short","static","strictfp",
    "super","switch","synchronized","this","throw","throws","transient","try","var","void",
    "volatile","while","true","false"],
  c: ["auto","break","case","char","const","continue","default","do","double","else","enum",
    "extern","float","for","goto","if","inline","int","long","register","restrict","return",
    "short","signed","sizeof","static","struct","switch","typedef","union","unsigned","void",
    "volatile","while","NULL"],
  cpp: ["alignas","alignof","and","and_eq","asm","auto","bitand","bitor","bool","break","case",
    "catch","char","char16_t","char32_t","class","compl","const","constexpr","const_cast",
    "continue","decltype","default","delete","do","double","dynamic_cast","else","enum",
    "explicit","export","extern","false","float","for","friend","goto","if","inline","int",
    "long","mutable","namespace","new","noexcept","not","not_eq","nullptr","operator","or",
    "or_eq","private","protected","public","register","reinterpret_cast","return","short",
    "signed","sizeof","static","static_assert","static_cast","struct","switch","template",
    "this","thread_local","throw","true","try","typedef","typeid","typename","union",
    "unsigned","using","virtual","void","volatile","wchar_t","while","xor","xor_eq","string",
    "vector","map","set","queue","stack","cout","cin","endl","include"],
  javascript: ["break","case","catch","class","const","continue","debugger","default","delete",
    "do","else","export","extends","false","finally","for","function","if","import","in",
    "instanceof","let","new","null","of","return","static","super","switch","this","throw",
    "true","try","typeof","undefined","var","void","while","with","yield","async","await"],
};

const BUILTINS = {
  python: ["print","len","range","int","str","float","bool","list","dict","set","tuple","type",
    "input","open","enumerate","zip","map","filter","sorted","reversed","sum","min","max",
    "abs","round","isinstance","issubclass","hasattr","getattr","setattr","delattr","repr",
    "format","chr","ord","hex","bin","oct","pow","divmod","id","hash","callable","iter",
    "next","super","property","classmethod","staticmethod","__init__","__str__","__repr__",
    "__len__","__enter__","__exit__","__add__","__eq__"],
  java: ["System","String","Integer","Double","Boolean","Math","ArrayList","HashMap","Arrays",
    "Collections","Object","Class","Thread","Exception","RuntimeException"],
  c: ["printf","scanf","malloc","free","calloc","realloc","sizeof","strlen","strcpy","strcat",
    "strcmp","strncpy","memcpy","memset","fopen","fclose","fread","fwrite","fprintf","fscanf",
    "exit","abort","assert"],
  cpp: ["std","cout","cin","endl","printf","scanf","malloc","free","string","vector","map",
    "set","queue","stack","pair","make_pair","sort","find","begin","end","push_back","pop_back",
    "size","empty","insert","erase","clear","reserve"],
  javascript: ["console","log","alert","prompt","confirm","document","window","Array","Object",
    "String","Number","Boolean","JSON","Math","Date","Promise","async","fetch","parseInt",
    "parseFloat","isNaN","isFinite","encodeURIComponent","decodeURIComponent","setTimeout",
    "setInterval","clearTimeout","clearInterval","map","filter","reduce","forEach","find",
    "some","every","includes","indexOf","push","pop","shift","unshift","splice","slice",
    "join","split","trim","replace","charAt","length","keys","values","entries","assign"],
};

function tokenize(code, lang) {
  const tokens = [];
  const keywords = new Set(KEYWORDS[lang] || []);
  const builtins = new Set(BUILTINS[lang] || []);
  let i = 0;
  const len = code.length;

  while (i < len) {
    // Commentaires ligne
    if ((lang === "python" || lang === "javascript") && code[i] === "#" && lang === "python") {
      let j = i;
      while (j < len && code[j] !== "\n") j++;
      tokens.push({ text: code.slice(i, j), type: "comment" });
      i = j;
      continue;
    }
    if (lang === "javascript" && code[i] === "/" && code[i+1] === "/") {
      let j = i;
      while (j < len && code[j] !== "\n") j++;
      tokens.push({ text: code.slice(i, j), type: "comment" });
      i = j;
      continue;
    }
    // Commentaires bloc /* ... */
    if ((lang === "c" || lang === "cpp" || lang === "java" || lang === "javascript") && code[i] === "/" && code[i+1] === "*") {
      let j = i + 2;
      while (j < len - 1 && !(code[j] === "*" && code[j+1] === "/")) j++;
      j += 2;
      tokens.push({ text: code.slice(i, j), type: "comment" });
      i = j;
      continue;
    }
    // Python # commentaire
    if (lang !== "python" && code[i] === "#") {
      let j = i;
      while (j < len && code[j] !== "\n") j++;
      tokens.push({ text: code.slice(i, j), type: "comment" });
      i = j;
      continue;
    }
    // Préprocesseur C/C++
    if ((lang === "c" || lang === "cpp") && code[i] === "#") {
      let j = i;
      while (j < len && code[j] !== "\n") j++;
      tokens.push({ text: code.slice(i, j), type: "preprocessor" });
      i = j;
      continue;
    }
    // Chaînes triple-quote Python
    if (lang === "python" && (code.startsWith('"""', i) || code.startsWith("'''", i))) {
      const q = code.slice(i, i+3);
      let j = i + 3;
      while (j < len && !code.startsWith(q, j)) j++;
      j += 3;
      tokens.push({ text: code.slice(i, j), type: "string" });
      i = j;
      continue;
    }
    // Chaînes f-string Python
    if (lang === "python" && (code[i] === "f" || code[i] === "F") && (code[i+1] === '"' || code[i+1] === "'")) {
      const q = code[i+1];
      let j = i + 2;
      while (j < len && code[j] !== q && code[j] !== "\n") {
        if (code[j] === "\\") j++;
        j++;
      }
      j++;
      tokens.push({ text: code.slice(i, j), type: "string" });
      i = j;
      continue;
    }
    // Chaînes simples/doubles
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let j = i + 1;
      while (j < len && code[j] !== q && code[j] !== "\n") {
        if (code[j] === "\\") j++;
        j++;
      }
      j++;
      tokens.push({ text: code.slice(i, j), type: "string" });
      i = j;
      continue;
    }
    // Nombres
    if (/[0-9]/.test(code[i]) || (code[i] === "." && /[0-9]/.test(code[i+1] || ""))) {
      let j = i;
      while (j < len && /[0-9a-fA-FxXbBoO._eE]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), type: "number" });
      i = j;
      continue;
    }
    // Identifiants / mots-clés
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < len && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      // Détecter fonction appelée (suivie de "(")
      const isCall = code[j] === "(";
      let type = "identifier";
      if (keywords.has(word)) type = "keyword";
      else if (builtins.has(word)) type = isCall ? "builtin" : "builtin";
      else if (isCall) type = "function";
      // Décorateurs Python
      else if (i > 0 && code[i-1] === "@") type = "decorator";
      tokens.push({ text: word, type });
      i = j;
      continue;
    }
    // Opérateurs
    if (/[+\-*/%=<>!&|^~?:,;.@]/.test(code[i])) {
      tokens.push({ text: code[i], type: "operator" });
      i++;
      continue;
    }
    // Ponctuation / brackets
    if (/[()[\]{}]/.test(code[i])) {
      tokens.push({ text: code[i], type: "punctuation" });
      i++;
      continue;
    }
    // Tout le reste (espaces, newlines, etc.)
    tokens.push({ text: code[i], type: "plain" });
    i++;
  }
  return tokens;
}

const TOKEN_COLORS = {
  keyword:     "#c792ea",
  string:      "#c3e88d",
  comment:     "#7ec8a0",
  number:      "#f78c6c",
  function:    "#82aaff",
  builtin:     "#89ddff",
  operator:    "#89ddff",
  punctuation: "#89ddff",
  preprocessor:"#c792ea",
  decorator:   "#ffcb6b",
  identifier:  "#eeffff",
  plain:       "#cdd6f4",
};

// ─── GÉNÉRATEUR PDF ──────────────────────────────────────────────────────────
const generatePDF = async (student, answers, questions, timeSpent) => {
  const qHtml = questions.map((q, idx) => `
    <div class="question-block">
      <div class="q-header">
        <span class="q-num">Question ${idx + 1}</span>
        <span class="q-lang">${getLangLabel(q.langage)}</span>
        <span class="q-type">${getTypeLabel(q.type)}</span>
      </div>
      <h3>${q.titre}</h3>
      <div class="enonce"><strong>Énoncé :</strong><br/>${q.enonce}</div>
      <div class="reponse">
        <strong>Réponse :</strong>
        <pre><code>${(answers[q.id] || "(aucune réponse)").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
      </div>
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Copie — ${student.prenom} ${student.nom}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@300;400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: white; }
  .page { max-width: 210mm; margin: 0 auto; padding: 20mm 18mm; }
  header { border-bottom: 3px solid #1a1a2e; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
  .logo { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .logo span { color: #6366f1; }
  .header-right { text-align: right; font-size: 12px; color: #555; }
  .cover { text-align: center; padding: 40px 0 30px; border-bottom: 1px solid #e5e7eb; margin-bottom: 32px; }
  .cover h1 { font-size: 28px; font-weight: 700; margin-bottom: 24px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left; max-width: 400px; margin: 0 auto; }
  .info-item { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 14px; }
  .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; }
  .info-value { font-size: 14px; font-weight: 600; margin-top: 2px; }
  .question-block { margin-bottom: 32px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; break-inside: avoid; }
  .q-header { background: #1a1a2e; color: white; padding: 8px 16px; display: flex; gap: 12px; align-items: center; font-size: 12px; }
  .q-num { font-weight: 700; font-size: 13px; }
  .q-lang { background: #6366f1; padding: 2px 8px; border-radius: 4px; }
  .q-type { background: #374151; padding: 2px 8px; border-radius: 4px; }
  h3 { padding: 12px 16px 8px; font-size: 15px; font-weight: 600; }
  .enonce { padding: 0 16px 12px; font-size: 13px; color: #374151; line-height: 1.6; }
  .reponse { padding: 12px 16px 16px; border-top: 1px solid #e5e7eb; }
  .reponse strong { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; }
  pre { margin-top: 8px; background: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; overflow-x: auto; white-space: pre-wrap; }
  footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between; font-size: 11px; color: #aaa; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <header>
    <div class="logo">Code<span>Exam</span> Pro</div>
    <div class="header-right">Plateforme d'évaluation de programmation<br/>Généré le ${new Date().toLocaleDateString("fr-FR", { dateStyle: "long" })}</div>
  </header>
  <div class="cover">
    <h1>Copie d'examen de programmation</h1>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Nom</div><div class="info-value">${student.nom}</div></div>
      <div class="info-item"><div class="info-label">Prénom</div><div class="info-value">${student.prenom}</div></div>
      <div class="info-item"><div class="info-label">Code Apogée</div><div class="info-value">${student.apogee}</div></div>
      <div class="info-item"><div class="info-label">Groupe</div><div class="info-value">${student.groupe || "—"}</div></div>
      <div class="info-item"><div class="info-label">Email</div><div class="info-value">${student.email || "—"}</div></div>
      <div class="info-item"><div class="info-label">Temps passé</div><div class="info-value">${formatTime(timeSpent)}</div></div>
      <div class="info-item"><div class="info-label">Questions répondues</div><div class="info-value">${Object.keys(answers).length} / ${questions.length}</div></div>
      <div class="info-item"><div class="info-label">Date</div><div class="info-value">${new Date().toLocaleDateString("fr-FR")}</div></div>
    </div>
  </div>
  ${qHtml}
  <footer>
    <span>CodeExam Pro — Copie générée automatiquement</span>
    <span>${student.prenom} ${student.nom} — ${student.apogee}</span>
  </footer>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `copie_${student.prenom}_${student.nom}_${student.apogee}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── EXPORT CSV ──────────────────────────────────────────────────────────────
const exportCSV = (records) => {
  const headers = ["Nom", "Prénom", "Apogée", "Email", "Groupe", "Questions répondues", "Temps passé", "Date"];
  const rows = records.map(r => [
    r.student?.nom || "", r.student?.prenom || "", r.student?.apogee || "",
    r.student?.email || "", r.student?.groupe || "",
    Object.keys(r.answers || {}).length, formatTime(r.timeSpent || 0),
    new Date(r.savedAt || 0).toLocaleString("fr-FR")
  ]);
  const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "codeexam_resultats.csv"; a.click();
  URL.revokeObjectURL(url);
};

// ─── COMPOSANTS UI ──────────────────────────────────────────────────────────

const LangBadge = ({ lang }) => (
  <span style={{
    background: getLangColor(lang) + "22",
    color: getLangColor(lang),
    border: `1px solid ${getLangColor(lang)}44`,
    borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700,
    fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.5,
  }}>{getLangLabel(lang)}</span>
);

const TypeBadge = ({ type }) => {
  const colors = { ecriture: ["#10B981", "#065F46"], completion: ["#F59E0B", "#78350F"], correction: ["#EF4444", "#7F1D1D"] };
  const [bg] = colors[type] || ["#6B7280", "#111"];
  return (
    <span style={{
      background: bg + "22", color: bg, border: `1px solid ${bg}44`,
      borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600,
    }}>{getTypeLabel(type)}</span>
  );
};

// ─── BARRE DE CARACTÈRES SPÉCIAUX ───────────────────────────────────────────
const SPECIAL_CHARS = [
  { label: "(", insert: "(" },
  { label: ")", insert: ")" },
  { label: "[", insert: "[" },
  { label: "]", insert: "]" },
  { label: "{", insert: "{" },
  { label: "}", insert: "}" },
  { label: "+", insert: "+" },
  { label: "−", insert: "-" },
  { label: "×", insert: "*" },
  { label: "÷", insert: "/" },
  { label: "=", insert: "=" },
  { label: "<", insert: "<" },
  { label: ">", insert: ">" },
  { label: '"', insert: '"' },
  { label: "'", insert: "'" },
  { label: ",", insert: "," },
  { label: ".", insert: "." },
  { label: ":", insert: ":" },
  { label: ";", insert: ";" },
  { label: "%", insert: "%" },
  null, // séparateur
  { label: "<=", insert: "<=" },
  { label: ">=", insert: ">=" },
  { label: "<>", insert: "<>" },
  { label: "==", insert: "==" },
  { label: "!=", insert: "!=" },
];

const SpecialCharsBar = ({ onInsert }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3,
      padding: "6px 12px", background: "#111827",
      borderBottom: "1px solid #1e2235",
    }}>
      {SPECIAL_CHARS.map((ch, i) =>
        ch === null ? (
          <div key={`sep-${i}`} style={{
            width: 1, height: 16, background: "#2d2d4a", margin: "0 4px", flexShrink: 0,
          }} />
        ) : (
          <button
            key={ch.label}
            onMouseDown={e => { e.preventDefault(); onInsert(ch.insert); }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            title={ch.insert !== ch.label ? ch.insert : undefined}
            style={{
              background: hovered === i ? "#2d2d4a" : "#1a1a2e",
              border: "1px solid #2d2d4a",
              borderRadius: 5,
              color: hovered === i ? "#a78bfa" : "#7c8aaa",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 6px",
              minWidth: ch.insert.length > 1 ? 32 : 22,
              cursor: "pointer",
              lineHeight: "16px",
              letterSpacing: 0,
              transition: "background 0.1s, color 0.1s, border-color 0.1s",
              borderColor: hovered === i ? "#4d4d6a" : "#2d2d4a",
              userSelect: "none",
            }}
          >{ch.label}</button>
        )
      )}
    </div>
  );
};

// ─── ÉDITEUR DE CODE AVEC COLORATION SYNTAXIQUE ──────────────────────────────
/**
 * Approche "highlighting overlay" :
 * - Un <pre> avec le code coloré est positionné en absolu derrière le <textarea>
 * - Le <textarea> est transparent (color:transparent, background:transparent, caret visible)
 * - Les deux scrollent en synchronisation
 * - Un <canvas> absolue dessine les guides d'indentation verticaux
 * - Des lignes horizontales alternées sont rendues via repeating-linear-gradient
 * Cela permet la coloration sans bibliothèque externe.
 */
const FONT_SIZES = [12, 13.5, 14, 16, 18, 20, 22, 24];
const DEFAULT_FONT_SIZE = 13.5;

// ─── GUIDES D'INDENTATION (canvas overlay) ───────────────────────────────────
const IndentGuides = memo(({ value, fontSize, scrollTop, scrollLeft, containerWidth, containerHeight }) => {
  const canvasRef = useRef(null);

  // Mesure la largeur d'un caractère monospace via un canvas hors-écran
  const charWidth = useMemo(() => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
    return ctx.measureText("M").width;
  }, [fontSize]);

  const lineHeight = useMemo(() => fontSize * 1.7, [fontSize]);
  const paddingTop = 16;
  const paddingLeft = 16;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, containerWidth, containerHeight);

    const lines = (value || "").split("\n");

    // Pour chaque ligne, calculer le niveau d'indentation (multiples de 4 espaces)
    // et collecter les colonnes de guides à tracer
    // On trace seulement là où il existe un contenu indenté plus profond
    const guideColumns = new Set();

    lines.forEach(line => {
      if (line.trim() === "") return; // ignorer les lignes vides
      let spaces = 0;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === " ") spaces++;
        else break;
      }
      const level = Math.floor(spaces / 4);
      for (let l = 1; l < level; l++) {
        guideColumns.add(l * 4);
      }
    });

    if (guideColumns.size === 0) return;

    ctx.strokeStyle = "rgba(80, 80, 130, 0.30)";
    ctx.lineWidth = 1;
    // Utiliser un tiret très discret
    ctx.setLineDash([2, 4]);

    guideColumns.forEach(col => {
      const x = paddingLeft + col * charWidth - scrollLeft + 0.5;
      if (x < paddingLeft - charWidth || x > containerWidth + charWidth) return;
      ctx.beginPath();
      ctx.moveTo(x, paddingTop - scrollTop);
      ctx.lineTo(x, paddingTop + lines.length * lineHeight - scrollTop);
      ctx.stroke();
    });

    ctx.setLineDash([]);
  }, [value, fontSize, charWidth, lineHeight, scrollTop, scrollLeft, containerWidth, containerHeight]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: containerWidth,
        height: containerHeight,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
});

const CodeEditor = memo(({ value, onChange, language, readOnly = false }) => {
  const taRef = useRef(null);
  const preRef = useRef(null);
  const containerRef = useRef(null);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [scroll, setScroll] = useState({ top: 0, left: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const tokens = tokenize(value || "", language);
  const lines = (value || "").split("\n");

  // Observer la taille du conteneur pour le canvas des guides
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    ro.observe(el);
    setContainerSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const syncScroll = () => {
    if (taRef.current && preRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
      setScroll({ top: taRef.current.scrollTop, left: taRef.current.scrollLeft });
    }
  };

  const insertAtCursor = useCallback((char) => {
    if (readOnly) return;
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const current = value || "";
    const newVal = current.substring(0, start) + char + current.substring(end);
    onChange(newVal);
    const newPos = start + char.length;
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = newPos;
    });
  }, [value, onChange, readOnly]);

  const handleKeyDown = (e) => {
    if (readOnly) return;
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    if (isCtrlOrCmd && ["c", "v", "x", "a"].includes(e.key.toLowerCase())) {
      e.preventDefault();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = taRef.current;
      const start = ta.selectionStart, end = ta.selectionEnd;
      const newVal = (value || "").substring(0, start) + "    " + (value || "").substring(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  };

  const lineHeight = fontSize * 1.7;

  // Style partagé — on force letter-spacing et word-spacing à 0
  // pour garantir l'alignement pixel-perfect entre <pre> et <textarea>
  const sharedStyle = {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: fontSize,
    lineHeight: `${lineHeight}px`,
    padding: "16px",
    margin: 0,
    border: "none",
    outline: "none",
    whiteSpace: "pre",
    overflowWrap: "normal",
    wordBreak: "normal",
    tabSize: 4,
    MozTabSize: 4,
    letterSpacing: "0",
    wordSpacing: "0",
    minHeight: 500,
    boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "relative", borderRadius: 10, overflow: "hidden",
      border: "1px solid #2d2d4a", background: "#0d0d1a",
    }}>
      {/* Header éditeur */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
        background: "#1a1a2e", borderBottom: "1px solid #2d2d4a",
      }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28CA41" }} />
        <span style={{ marginLeft: 12, color: "#666", fontSize: 12 }}>
          solution.{language === "cpp" ? "cpp" : language === "java" ? "java" : language === "c" ? "c" : language === "javascript" ? "js" : "py"}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          {/* Contrôle taille de texte */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => setFontSize(f => {
                const idx = FONT_SIZES.indexOf(f);
                return idx > 0 ? FONT_SIZES[idx - 1] : f;
              })}
              disabled={fontSize <= FONT_SIZES[0]}
              title="Réduire la taille du texte"
              style={{
                background: "#0d0d1a", border: "1px solid #2d2d4a", borderRadius: 5,
                color: fontSize <= FONT_SIZES[0] ? "#3d3d5c" : "#94a3b8",
                fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700,
                padding: "2px 7px", cursor: fontSize <= FONT_SIZES[0] ? "default" : "pointer",
                lineHeight: "16px", userSelect: "none",
              }}
            >A−</button>
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#555",
              minWidth: 32, textAlign: "center",
            }}>{fontSize}px</span>
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => setFontSize(f => {
                const idx = FONT_SIZES.indexOf(f);
                return idx < FONT_SIZES.length - 1 ? FONT_SIZES[idx + 1] : f;
              })}
              disabled={fontSize >= FONT_SIZES[FONT_SIZES.length - 1]}
              title="Augmenter la taille du texte"
              style={{
                background: "#0d0d1a", border: "1px solid #2d2d4a", borderRadius: 5,
                color: fontSize >= FONT_SIZES[FONT_SIZES.length - 1] ? "#3d3d5c" : "#94a3b8",
                fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700,
                padding: "2px 7px", cursor: fontSize >= FONT_SIZES[FONT_SIZES.length - 1] ? "default" : "pointer",
                lineHeight: "16px", userSelect: "none",
              }}
            >A+</button>
          </div>
          <LangBadge lang={language} />
        </div>
      </div>

      {/* Barre de caractères spéciaux */}
      {!readOnly && <SpecialCharsBar onInsert={insertAtCursor} />}

      {/* Zone code : numéros + overlay + textarea */}
      <div style={{ display: "flex", maxHeight: 650, overflow: "hidden", background: "#0d0d1a" }}>
        {/* Numéros de ligne */}
        <div style={{
          padding: "16px 0",
          minWidth: 48,
          textAlign: "right",
          color: "#3d3d5c",
          fontSize: fontSize,
          lineHeight: `${lineHeight}px`,
          userSelect: "none",
          background: "#0a0a16",
          borderRight: "1px solid #1a1a2e",
          paddingRight: 12,
          fontFamily: "JetBrains Mono, monospace",
          letterSpacing: 0,
          flexShrink: 0,
        }}>
          {lines.map((_, i) => (
            <div key={i} style={{ paddingRight: 8 }}>{i + 1}</div>
          ))}
        </div>

        {/* Conteneur overlay + textarea */}
        <div
          ref={containerRef}
          style={{ position: "relative", flex: 1, overflow: "auto", textAlign: "left", minHeight: 500 }}
          onScroll={() => syncScroll()}
        >
          {/* Guides d'indentation verticaux (canvas, z=1) */}
          {containerSize.width > 0 && (
            <IndentGuides
              value={value}
              fontSize={fontSize}
              scrollTop={scroll.top}
              scrollLeft={scroll.left}
              containerWidth={containerSize.width}
              containerHeight={Math.max(containerSize.height, 500)}
            />
          )}

          {/* Pre de coloration (derrière, z=2) avec lignes horizontales */}
          <pre
            ref={preRef}
            aria-hidden="true"
            style={{
              ...sharedStyle,
              position: "absolute",
              top: 0, left: 0, right: 0,
              pointerEvents: "none",
              color: "#cdd6f4",

              overflow: "hidden",
              zIndex: 2,
            }}
          >
            {tokens.map((tok, idx) => (
              <span key={idx} style={{ color: TOKEN_COLORS[tok.type] || "#cdd6f4" }}>
                {tok.text}
              </span>
            ))}
            {/* Padding pour éviter le scroll décalé */}
            {"\n"}
          </pre>

          {/* Sizer invisible pour forcer la hauteur du conteneur */}
          <pre aria-hidden="true" style={{
            ...sharedStyle,
            visibility: "hidden",
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 0,
          }}>
            {(value || "") + "\n"}
          </pre>

          {/* Textarea transparent (devant, z=3) */}
          <textarea
            ref={taRef}
            value={value || ""}
            onChange={e => !readOnly && onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            onPaste={e => e.preventDefault()}
            onCopy={e => e.preventDefault()}
            onCut={e => e.preventDefault()}
            onContextMenu={e => e.preventDefault()}
            onDrop={e => e.preventDefault()}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            style={{
              ...sharedStyle,
              position: "absolute",
              top: 0, left: 0,
              zIndex: 3,
              display: "block",
              width: "100%",
              height: "100%",
              minHeight: sharedStyle.minHeight,
              resize: "none",
              background: "transparent",
              color: "transparent",
              caretColor: "#a78bfa",
              overflow: "hidden",
              // Garantir l'alignement parfait du curseur — même rendu typographique que le <pre>
              WebkitFontSmoothing: "auto",
              MozOsxFontSmoothing: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
});

// ─── BARRE DE PROGRESSION ────────────────────────────────────────────────────
const ProgressBar = ({ current, total, timeLeft, totalTime }) => {
  const pct = Math.round((current / total) * 100);
  const timeColor = timeLeft < 600 ? "#EF4444" : timeLeft < 1800 ? "#F59E0B" : "#10B981";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888" }}>
        <span>Question {current} / {total}</span>
        <span style={{ color: timeColor, fontWeight: 600, fontFamily: "JetBrains Mono, monospace" }}>
          ⏱ {formatTime(timeLeft)}
        </span>
      </div>
      <div style={{ height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
          borderRadius: 3, transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
};

// ─── CHAMP D'AUTHENTIFICATION ────────────────────────────────────────────────
const AuthField = React.memo(({ id, label, placeholder, required, type = "text", value, error, onChange, onSubmit }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
      {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(id, e.target.value)}
      onKeyDown={e => e.key === "Enter" && onSubmit()}
      style={{
        background: error ? "#2d1a1a" : "#0d0d1a",
        border: `1.5px solid ${error ? "#ef4444" : "#2d2d4a"}`,
        borderRadius: 10, padding: "11px 16px", color: "#e2e8f0", fontSize: 15,
        outline: "none", transition: "border-color 0.2s",
      }}
    />
    {error && <span style={{ color: "#ef4444", fontSize: 12 }}>{error}</span>}
  </div>
));

// ─── ÉCRAN D'AUTHENTIFICATION ────────────────────────────────────────────────
const AuthScreen = ({ onLogin }) => {
  const [form, setForm] = useState({ nom: "", prenom: "", apogee: "" });
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = "Champ requis";
    if (!form.prenom.trim()) e.prenom = "Champ requis";
    if (!form.apogee.trim()) e.apogee = "Champ requis";
    else if (!/^\d{6,10}$/.test(form.apogee.trim())) e.apogee = "Code Apogée invalide (6-10 chiffres)";
    return e;
  };

  const handleSubmit = useCallback(() => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e); setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onLogin({ ...form, nom: form.nom.trim(), prenom: form.prenom.trim(), apogee: form.apogee.trim() });
  }, [form, onLogin]);

  const handleFieldChange = useCallback((id, value) => {
    setForm(f => ({ ...f, [id]: value }));
    setErrors(er => ({ ...er, [id]: undefined }));
  }, []);

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#050510",
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundImage: "radial-gradient(ellipse at 20% 50%, #1a0a3a 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #0a1a3a 0%, transparent 50%)",
      overflow: "hidden",
    }}>
      <div style={{
        width: "100%", maxWidth: 480, padding: "0 20px",
        animation: shake ? "shake 0.5s ease" : "slideUp 0.5s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 16, padding: "12px 24px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 28 }}>⌨️</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: -0.5 }}>CodeExam Pro</span>
          </div>
          <p style={{ color: "#64748b", fontSize: 15, margin: 0 }}>Plateforme d'évaluation de programmation</p>
        </div>

        {/* Carte */}
        <div style={{
          background: "rgba(15,15,30,0.9)", border: "1px solid #2d2d4a",
          borderRadius: 20, padding: 32, backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}>
          <h2 style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 700, marginBottom: 24, marginTop: 0 }}>Identification étudiant</h2>

          <div style={{ display: "flex",textAlign:"left", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <AuthField id="nom" label="Nom" placeholder="Nom" required value={form.nom} error={errors.nom} onChange={handleFieldChange} onSubmit={handleSubmit} />
              <AuthField id="prenom" label="Prénom" placeholder="Prénom" required value={form.prenom} error={errors.prenom} onChange={handleFieldChange} onSubmit={handleSubmit} />
            </div>
            <AuthField id="apogee" label="Code Apogée" placeholder="12345678" required value={form.apogee} error={errors.apogee} onChange={handleFieldChange} onSubmit={handleSubmit} />

            <button onClick={handleSubmit} style={{
              marginTop: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white", border: "none", borderRadius: 12, padding: "14px",
              fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%",
              transition: "all 0.2s", boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            }}
              onMouseOver={e => e.target.style.transform = "translateY(-1px)"}
              onMouseOut={e => e.target.style.transform = "translateY(0)"}
            >
              Commencer l'examen →
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "#334155", fontSize: 12 }}>
          Mode enseignant :{" "}
          <button onClick={() => onLogin(null)} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 12 }}>
            Accès administrateur
          </button>
        </p>
      </div>
    </div>
  );
};

// ─── TABLEAU DE BORD ÉTUDIANT ────────────────────────────────────────────────
const StudentDashboard = ({ student, answers, questions, timeLeft, totalTime }) => {
  const answered = Object.keys(answers).filter(k => answers[k] && answers[k].trim() !== questions.find(q => q.id === parseInt(k))?.codeInitial?.trim()).length;
  const pct = Math.round((answered / questions.length) * 100); 
};

// ─── ÉCRAN D'EXAMEN ──────────────────────────────────────────────────────────
const ExamScreen = ({ student, onSubmit }) => {
  // ─── Sélection des 20 questions de CET examen ──────────────────────────
  // La sélection est calculée UNE SEULE FOIS au montage du composant
  // (initialiseur de useState), donc elle ne change jamais lors des
  // re-rendus suivants (timer, saisie, navigation, etc.).
  // Si un examen était déjà en cours pour cet étudiant (ex: rechargement
  // de la page), on restaure exactement les mêmes questions à partir des
  // identifiants sauvegardés, afin de ne jamais re-tirer une nouvelle
  // sélection en cours de test.
  const [questions] = useState(() => {
    const saved = loadState();
    if (saved?.student?.apogee === student.apogee) {
      const restored = getQuestionsByIds(saved.questionIds);
      if (restored.length > 0) return restored;
    }
    return selectRandomQuestions(banqueQuestions, QUESTIONS_PER_EXAM);
  });
  // Identifiants des questions sélectionnées, utilisés pour la persistance
  // (on ne sauvegarde que les ids, jamais le contenu complet des questions).
  const questionIds = useMemo(() => questions.map(q => q.id), [questions]);

  const totalTime = EXAM_DURATION_MINUTES;

  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime * 60);
  const [timeSpent, setTimeSpent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [tabViolations, setTabViolations] = useState(0);
  const [activityLog, setActivityLog] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const currentQ = questions[currentIdx];

  useEffect(() => {
    const saved = loadState();
    if (saved?.student?.apogee === student.apogee) {
      setAnswers(saved.answers || {});
      setTimeLeft(saved.timeLeft || totalTime * 60);
      setTimeSpent(saved.timeSpent || 0);
      setActivityLog(saved.activityLog || []);
      setTabViolations(saved.tabViolations || 0);
    } else {
      const initial = {};
      questions.forEach(q => { initial[q.id] = q.codeInitial || ""; });
      setAnswers(initial);
    }
  }, []);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); handleSubmit(true); return 0; }
        return prev - 1;
      });
      setTimeSpent(s => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      saveState({ student, answers, timeLeft, timeSpent, activityLog, tabViolations, questionIds });
      setLastSaved(new Date());
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [answers, timeLeft, timeSpent, submitted]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !submitted) {
        const newCount = tabViolations + 1;
        setTabViolations(newCount);
        const log = [...activityLog, { time: new Date().toISOString(), event: `Changement d'onglet #${newCount}` }];
        setActivityLog(log);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 4000);
        saveState({ student, answers, timeLeft, timeSpent, activityLog: log, tabViolations: newCount, questionIds });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [tabViolations, activityLog, answers, timeLeft, submitted]);

  const handleSubmit = useCallback((auto = false) => {
    setSubmitted(true);
    saveState({ student, answers, timeLeft: 0, timeSpent, activityLog, tabViolations, submitted: true, questionIds });
    onSubmit({ student, answers, timeSpent, tabViolations, activityLog, auto, questions });
  }, [student, answers, timeSpent, tabViolations, activityLog, questions, questionIds]);

  const navigate = (dir) => {
    setCurrentIdx(i => Math.max(0, Math.min(questions.length - 1, i + dir)));
  };

  const handleCodeChange = useCallback((val) => {
    setAnswers(a => ({ ...a, [currentQ.id]: val }));
  }, [currentQ.id]);

  const answeredCount = Object.keys(answers).filter(k => {
    const q = questions.find(q => q.id === parseInt(k));
    return answers[k] && answers[k].trim() !== (q?.codeInitial || "").trim();
  }).length;

  if (submitted) {
    return (
      <div style={{
        width: "100vw", height: "100vh", background: "#050510",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 20, color: "white",
      }}>
        <div style={{ fontSize: 64 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Examen soumis !</h1>
        <p style={{ color: "#64748b", margin: 0 }}>{answeredCount} / {questions.length} questions répondues — {formatTime(timeSpent)} passé</p>
        <button onClick={() => window.print()} style={{
          marginTop: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "white", border: "none", borderRadius: 12, padding: "12px 28px",
          fontSize: 15, fontWeight: 700, cursor: "pointer",
        }}>📄 Télécharger ma copie (PDF)</button>
      </div>
    );
  }

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#050510",
      display: "flex", flexDirection: "column", overflow: "hidden",
      color: "#e2e8f0",
    }}>
      {/* TOP BAR */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "10px 20px", background: "rgba(13,13,26,0.95)",
        borderBottom: "1px solid #1a1a2e", backdropFilter: "blur(10px)",
        zIndex: 100, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
          <span style={{ fontSize: 18 }}>⌨️</span>
          <span style={{ fontWeight: 800, fontSize: 16, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CodeExam Pro
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <ProgressBar current={currentIdx + 1} total={questions.length} timeLeft={timeLeft} totalTime={totalTime} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 200, justifyContent: "flex-end" }}>
          {tabViolations > 0 && (
            <span style={{ background: "#7f1d1d", color: "#fca5a5", borderRadius: 6, padding: "2px 8px", fontSize: 12 }}>
              ⚠️ {tabViolations} violation{tabViolations > 1 ? "s" : ""}
            </span>
          )}
          <span style={{ color: "#334155", fontSize: 11 }}>
            {lastSaved ? `✓ ${lastSaved.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : ""}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d0d1a", borderRadius: 8, padding: "6px 12px", border: "1px solid #1a1a2e" }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
              {student.prenom[0]}{student.nom[0]}
            </span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{student.prenom} {student.nom}</span>
          </div>
          <button onClick={() => { if (window.confirm("Soumettre l'examen ?")) handleSubmit(); }} style={{
            background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "white", border: "none",
            borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>Soumettre</button>
        </div>
      </div>

      {/* AVERTISSEMENT ONGLET */}
      {showWarning && (
        <div style={{
          position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
          background: "#7f1d1d", border: "1px solid #ef4444", borderRadius: 12,
          padding: "12px 24px", color: "#fca5a5", fontWeight: 600, zIndex: 200,
          boxShadow: "0 8px 30px rgba(239,68,68,0.3)", animation: "slideDown 0.3s ease",
        }}>
          ⚠️ Changement d'onglet détecté — Violation {tabViolations}/{MAX_TAB_VIOLATIONS}
        </div>
      )}

      {/* BODY */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* SIDEBAR */}
        {showSidebar && (
          <div style={{
            width: 220, background: "#0a0a16", borderRight: "1px solid #1a1a2e",
            overflowY: "auto", flexShrink: 0, padding: "12px 8px",
          }}>
            <div style={{ padding: "0 8px 10px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#334155", fontWeight: 700 }}>
              Questions ({answeredCount}/{questions.length})
            </div>
            {questions.map((q, i) => {
              const isAnswered = answers[q.id] && answers[q.id].trim() !== q.codeInitial?.trim();
              const isActive = i === currentIdx;
              return (
                <button key={q.id} onClick={() => setCurrentIdx(i)} style={{
                  width: "100%", textAlign: "left",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.12))"
                    : "transparent",
                  border: `1px solid ${isActive ? "#6366f155" : "transparent"}`,
                  borderRadius: 10, padding: "9px 10px", cursor: "pointer",
                  marginBottom: 4, transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 7, flexShrink: 0, fontSize: 11,
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800,
                    fontFamily: "'Nunito', sans-serif",
                    background: isAnswered ? "#10B98122" : isActive ? "#6366f122" : "#1a1a2e",
                    color: isAnswered ? "#10B981" : isActive ? "#818cf8" : "#444",
                    border: `1px solid ${isAnswered ? "#10B98144" : isActive ? "#6366f144" : "#2d2d4a"}`,
                    boxShadow: isActive ? "0 0 8px rgba(99,102,241,0.2)" : "none",
                  }}>{i + 1}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 11.5, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
                      color: isActive ? "#e2e8f0" : isAnswered ? "#94a3b8" : "#4a5568",
                      lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{q.titre}</div>
                    <div style={{ fontSize: 10, color: getLangColor(q.langage), marginTop: 1 }}>{getLangLabel(q.langage)}</div>
                  </div>
                  {isAnswered && (
                    <span style={{ marginLeft: "auto", fontSize: 12, flexShrink: 0 }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* MAIN AREA */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {/* Question + Éditeur */}
          <div style={{ flex: 1, overflow: "auto", padding: "12px 20px 16px" }}>
            <div className="question-grid" style={{ minHeight: 0 }}>
              {/* Énoncé */}
              <div className="question-card" style={{
                background: "linear-gradient(160deg, #0d0d1f 0%, #0a0a18 100%)",
                border: "1px solid #1e1e3a",
                borderRadius: 16,
                overflow: "auto",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
                display: "flex", flexDirection: "column", gap: 0,
              }}>
                {/* En-tête de la question */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    {/* Numéro */}
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
                      border: "1px solid rgba(99,102,241,0.3)",
                      borderRadius: 8, padding: "3px 10px", marginBottom: 10,
                    }}>
                      <span style={{ color: "#818cf8", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Nunito', sans-serif" }}>
                        Question {currentIdx + 1} / {questions.length}
                      </span>
                    </div>
                    {/* Titre */}
                    <h2 style={{
                      fontSize: 19.5, fontWeight: 800, color: "#f8fafc",
                      lineHeight: 1.4, margin: 0,
                      fontFamily: "'Nunito', sans-serif", letterSpacing: "-0.3px",
                    }}>
                      {currentQ.titre}
                    </h2>
                  </div>
                  <button onClick={() => setShowSidebar(s => !s)} style={{
                    background: "#1a1a2e", border: "1px solid #2d2d4a", borderRadius: 8,
                    color: "#64748b", cursor: "pointer", padding: "5px 11px", fontSize: 12,
                    flexShrink: 0, transition: "all 0.15s",
                  }}>{showSidebar ? "◀" : "▶"}</button>
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                  <LangBadge lang={currentQ.langage} />
                  <TypeBadge type={currentQ.type} />
                </div>

                {/* Séparateur */}
                <div style={{ height: 1, background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)", marginBottom: 18 }} />

                {/* Énoncé avec rendu LaTeX */}
                <div className="enonce-box" style={{
                  flex: 1,
                  background: "rgba(99,102,241,0.04)",
                  border: "1px solid rgba(99,102,241,0.1)",
                  borderRadius: 12,
                }}>
                  <div style={{
                    fontSize: 11.5, fontWeight: 800, letterSpacing: 1.3,
                    textTransform: "uppercase", color: "#a5b4fc",
                    marginBottom: 14, paddingBottom: 10,
                    borderBottom: "1px solid rgba(99,102,241,0.15)",
                    fontFamily: "'Nunito', sans-serif",
                  }}>
                    📋 Énoncé
                  </div>
                  <MathText text={currentQ.enonce} />
                </div>

                {/* Navigation */}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button onClick={() => navigate(-1)} disabled={currentIdx === 0} style={{
                    flex: 1, background: currentIdx === 0 ? "#0a0a16" : "#1a1a2e",
                    border: "1px solid #2d2d4a", borderRadius: 10, padding: "10px",
                    color: currentIdx === 0 ? "#2d2d4a" : "#94a3b8",
                    cursor: currentIdx === 0 ? "not-allowed" : "pointer",
                    fontWeight: 700, fontSize: 13, fontFamily: "'Nunito', sans-serif",
                    transition: "all 0.2s",
                  }}>← Précédente</button>
                  <button onClick={() => navigate(1)} disabled={currentIdx === questions.length - 1} style={{
                    flex: 1,
                    background: currentIdx === questions.length - 1 ? "#0a0a16" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    border: "none", borderRadius: 10, padding: "10px",
                    color: currentIdx === questions.length - 1 ? "#2d2d4a" : "white",
                    cursor: currentIdx === questions.length - 1 ? "not-allowed" : "pointer",
                    fontWeight: 700, fontSize: 13, fontFamily: "'Nunito', sans-serif",
                    transition: "all 0.2s",
                    boxShadow: currentIdx === questions.length - 1 ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                  }}>Suivante →</button>
                </div>
              </div>

              {/* Éditeur */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: "#64748b",
                    fontFamily: "'Nunito', sans-serif", letterSpacing: 0.3,
                  }}>✏️ Votre réponse</span>
                  <button onClick={() => setAnswers(a => ({ ...a, [currentQ.id]: currentQ.codeInitial }))} style={{
                    background: "none", border: "1px solid #2d2d4a", borderRadius: 7,
                    color: "#64748b", cursor: "pointer", padding: "3px 11px", fontSize: 11,
                    fontFamily: "'Nunito', sans-serif", fontWeight: 600,
                  }}>↺ Réinitialiser</button>
                </div>
                <CodeEditor
                  value={answers[currentQ.id] || ""}
                  onChange={handleCodeChange}
                  language={currentQ.langage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── INTERFACE ENSEIGNANT ────────────────────────────────────────────────────
const TeacherDashboard = ({ onBack }) => {
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [search, setSearch] = useState("");
  const [filterGroupe, setFilterGroupe] = useState("");

  const saved = loadState();
  const records = saved?.student ? [saved] : [];

  const mockRecords = [
    { student: { nom: "MARTIN", prenom: "Alice", apogee: "20230001", email: "alice@univ.fr", groupe: "L3 INFO — A" }, answers: { 1: "def factorielle(n):\n    if n<=1: return 1\n    return n*factorielle(n-1)", 2: "...", 3: "..." }, timeSpent: 2847, tabViolations: 0, savedAt: Date.now() - 3600000 },
    { student: { nom: "DUPONT", prenom: "Bob", apogee: "20230042", email: "bob@univ.fr", groupe: "L3 INFO — B" }, answers: { 1: "def factorielle(n):\n    return 1 if n<=1 else n*factorielle(n-1)" }, timeSpent: 1520, tabViolations: 2, savedAt: Date.now() - 7200000 },
    { student: { nom: "COHEN", prenom: "Clara", apogee: "20230078", groupe: "L3 INFO — A" }, answers: {}, timeSpent: 420, tabViolations: 1, savedAt: Date.now() - 1800000 },
    ...records,
  ];

  const filtered = mockRecords.filter(r =>
    (!search || `${r.student?.nom} ${r.student?.prenom} ${r.student?.apogee}`.toLowerCase().includes(search.toLowerCase())) &&
    (!filterGroupe || r.student?.groupe?.includes(filterGroupe))
  );

  // Pour chaque étudiant, la sélection aléatoire de questions est différente :
  // on reconstruit donc la liste exacte des questions de SON examen
  // (via les questionIds sauvegardés), avec repli sur les données de
  // démonstration historiques qui n'en disposent pas.
  const filteredWithQuestions = filtered.map(r => ({ ...r, examQuestions: resolveExamQuestions(r) }));

  const groupes = [...new Set(mockRecords.map(r => r.student?.groupe).filter(Boolean))];
  const avgAnswered = mockRecords.reduce((s, r) => s + Object.keys(r.answers || {}).length, 0) / mockRecords.length;

  if (!auth) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#050510", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ background: "#0d0d1a", border: "1px solid #2d2d4a", borderRadius: 20, padding: 36, width: 340 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔐</div>
            <h2 style={{ color: "#e2e8f0", fontWeight: 700, margin: 0 }}>Espace enseignant</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>Accès protégé par mot de passe</p>
          </div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && password === TEACHER_PASSWORD) setAuth(true); }}
            placeholder="Mot de passe enseignant" style={{
              width: "100%", background: "#0a0a16", border: "1.5px solid #2d2d4a",
              borderRadius: 10, padding: "12px 16px", color: "#e2e8f0", fontSize: 15, outline: "none",
            }} />
          <button onClick={() => { if (password === TEACHER_PASSWORD) setAuth(true); else alert("Mot de passe incorrect"); }} style={{
            width: "100%", marginTop: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "white", border: "none", borderRadius: 10, padding: 12, fontWeight: 700, cursor: "pointer", fontSize: 15,
          }}>Accéder au tableau de bord</button>
          <button onClick={onBack} style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13 }}>← Retour</button>
           
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#050510",
      color: "#e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 24px", background: "#0a0a16", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <span style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>⌨️ CodeExam Pro</span>
        <span style={{ background: "#6366f122", color: "#6366f1", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>ENSEIGNANT</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => exportCSV(mockRecords)} style={{ background: "#10B98122", border: "1px solid #10B98144", color: "#10B981", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>⬇ Export CSV</button>
        <button onClick={onBack} style={{ background: "#1a1a2e", border: "1px solid #2d2d4a", color: "#94a3b8", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>← Retour</button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Étudiants", value: mockRecords.length, icon: "👥", color: "#6366f1" },
              { label: "Questions moy.", value: avgAnswered.toFixed(1), icon: "📝", color: "#10B981" },
              { label: "Questions / examen", value: Math.min(QUESTIONS_PER_EXAM, banqueQuestions.length), icon: "📚", color: "#F59E0B" },
              { label: "Durée examen", value: `${EXAM_DURATION_MINUTES} min`, icon: "⏱", color: "#8b5cf6" },
            ].map(s => (
              <div key={s.label} style={{ background: "#0d0d1a", border: `1px solid ${s.color}33`, borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filtres */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher un étudiant..." style={{
              flex: 1, background: "#0d0d1a", border: "1px solid #2d2d4a", borderRadius: 10,
              padding: "10px 16px", color: "#e2e8f0", fontSize: 14, outline: "none",
            }} />
            <select value={filterGroupe} onChange={e => setFilterGroupe(e.target.value)} style={{
              background: "#0d0d1a", border: "1px solid #2d2d4a", borderRadius: 10,
              padding: "10px 16px", color: "#e2e8f0", fontSize: 14, outline: "none",
            }}>
              <option value="">Tous les groupes</option>
              {groupes.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Table */}
          <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1a1a2e" }}>
                  {["Étudiant", "Apogée", "Groupe", "Répondues", "Temps", "Violations", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredWithQuestions.map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1a1a2e", transition: "background 0.15s" }}
                    onMouseOver={e => e.currentTarget.style.background = "#1a1a2e55"}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{r.student?.nom} {r.student?.prenom}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{r.student?.email}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono,monospace", fontSize: 13, color: "#94a3b8" }}>{r.student?.apogee}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#94a3b8" }}>{r.student?.groupe || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: "#1a1a2e", borderRadius: 3 }}>
                          <div style={{ height: "100%", width: `${(Object.keys(r.answers || {}).length / r.examQuestions.length) * 100}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 36 }}>{Object.keys(r.answers || {}).length}/{r.examQuestions.length}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono,monospace", fontSize: 13, color: "#94a3b8" }}>{formatTime(r.timeSpent || 0)}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        background: (r.tabViolations || 0) > 0 ? "#7f1d1d" : "#14532d",
                        color: (r.tabViolations || 0) > 0 ? "#fca5a5" : "#86efac",
                        borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 600,
                      }}>{r.tabViolations || 0}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => generatePDF(r.student, r.answers, r.examQuestions, r.timeSpent || 0)} style={{
                        background: "#6366f122", border: "1px solid #6366f144", color: "#6366f1",
                        borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600,
                      }}>📄 PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredWithQuestions.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: "#334155" }}>Aucun étudiant trouvé</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ÉCRAN DE RÉSULTAT ───────────────────────────────────────────────────────
const ResultScreen = ({ result, onReset }) => {
  const { student, answers, timeSpent, tabViolations, auto } = result;
  // Liste exacte des 20 questions tirées au sort pour CET examen.
  const examQuestions = resolveExamQuestions(result);
  const answered = Object.keys(answers).filter(k => {
    const q = examQuestions.find(q => q.id === parseInt(k));
    return answers[k] && answers[k].trim() !== (q?.codeInitial || "").trim();
  }).length;

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#050510",
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundImage: "radial-gradient(ellipse at 50% 100%, #1a0a3a 0%, transparent 60%)",
      color: "#e2e8f0", overflow: "hidden",
    }}>
      <div style={{ textAlign: "center", maxWidth: 500, padding: 40 }}>
        <div style={{ fontSize: 72, marginBottom: 16, animation: "bounce 0.6s ease" }}>
          {auto ? "⏰" : "🎉"}
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, marginTop: 0 }}>
          {auto ? "Temps écoulé !" : "Examen soumis avec succès !"}
        </h1>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 32 }}>
          {student.prenom} {student.nom} — {student.apogee}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Questions répondues", value: `${answered} / ${examQuestions.length}`, color: "#10B981" },
            { label: "Temps passé", value: formatTime(timeSpent), color: "#6366f1" },
            { label: "Taux de complétion", value: `${Math.round((answered / examQuestions.length) * 100)}%`, color: "#F59E0B" },
            { label: "Violations détectées", value: tabViolations, color: tabViolations > 0 ? "#EF4444" : "#10B981" },
          ].map(s => (
            <div key={s.label} style={{ background: "#0d0d1a", border: `1px solid ${s.color}33`, borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => generatePDF(student, answers, examQuestions, timeSpent)} style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none",
            borderRadius: 12, padding: "12px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}>📄 Télécharger ma copie</button>
          <button onClick={onReset} style={{
            background: "#1a1a2e", border: "1px solid #2d2d4a", color: "#94a3b8",
            borderRadius: 12, padding: "12px 24px", fontSize: 15, cursor: "pointer",
          }}>← Retour à l'accueil</button>
        </div>
      </div>
    </div>
  );
};

// ─── APP PRINCIPALE ──────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("auth");
  const [student, setStudent] = useState(null);
  const [examResult, setExamResult] = useState(null);

  useEffect(() => {
    const saved = loadState();
    if (saved?.student && !saved?.submitted) {
      if (window.confirm(`Reprendre l'examen de ${saved.student.prenom} ${saved.student.nom} ?`)) {
        setStudent(saved.student);
        setScreen("exam");
      }
    }
  }, []);

  const handleLogin = (studentData) => {
    if (!studentData) { setScreen("teacher"); return; }
    setStudent(studentData);
    setScreen("exam");
  };

  const handleSubmit = (result) => {
    setExamResult(result);
    setScreen("result");
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudent(null); setExamResult(null); setScreen("auth");
  };

  return (
    <>
      <GlobalStyle />
      {screen === "auth" && <AuthScreen onLogin={handleLogin} />}
      {screen === "exam" && student && <ExamScreen student={student} onSubmit={handleSubmit} />}
      {screen === "result" && examResult && <ResultScreen result={examResult} onReset={handleReset} />}
      {screen === "teacher" && <TeacherDashboard onBack={() => setScreen("auth")} />}
    </>
  );
}
