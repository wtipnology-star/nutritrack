import { useState, useEffect, useRef, useCallback } from "react";

const GFIT_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";
const GFIT_SCOPE = "https://www.googleapis.com/auth/fitness.body.read";

const C = {
  bg: "#0d1117", surface: "#161b22", surfaceAlt: "#1c2230", border: "#2a3347",
  teal: "#14b8a6", tealDim: "#0f766e", tealGlow: "rgba(20,184,166,0.15)",
  amber: "#f59e0b", red: "#ef4444", green: "#22c55e", purple: "#a78bfa",
  text: "#e2e8f0", textMuted: "#64748b", textDim: "#94a3b8",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'Inter',sans-serif;}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
  .mono{font-family:'JetBrains Mono',monospace;}
  .card{background:${C.surface};border:1px solid ${C.border};border-radius:16px;}
  .card-alt{background:${C.surfaceAlt};border:1px solid ${C.border};border-radius:12px;}
  .btn-primary{background:${C.teal};color:#000;font-weight:600;border:none;border-radius:10px;cursor:pointer;padding:12px 20px;font-size:14px;transition:all .2s;font-family:Inter,sans-serif;}
  .btn-primary:hover{background:#0d9488;transform:translateY(-1px);}
  .btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;}
  .btn-ghost{background:transparent;color:${C.textDim};border:1px solid ${C.border};border-radius:10px;cursor:pointer;padding:10px 16px;font-size:14px;transition:all .2s;font-family:Inter,sans-serif;}
  .btn-ghost:hover{border-color:${C.teal};color:${C.teal};}
  .btn-danger{background:transparent;color:${C.red};border:1px solid rgba(239,68,68,.3);border-radius:8px;cursor:pointer;padding:6px 12px;font-size:12px;transition:all .2s;font-family:Inter,sans-serif;}
  .btn-danger:hover{background:rgba(239,68,68,.1);}
  .btn-google{background:#4285f4;color:#fff;font-weight:600;border:none;border-radius:10px;cursor:pointer;padding:11px 18px;font-size:13px;transition:all .2s;font-family:Inter,sans-serif;display:flex;align-items:center;gap:8px;justify-content:center;}
  .btn-google:hover{background:#3367d6;transform:translateY(-1px);}
  .btn-google:disabled{opacity:.5;cursor:not-allowed;transform:none;}
  .input{background:${C.bg};border:1px solid ${C.border};border-radius:10px;color:${C.text};padding:11px 14px;font-size:14px;outline:none;font-family:Inter,sans-serif;width:100%;transition:border-color .2s;}
  .input:focus{border-color:${C.teal};}
  .input::placeholder{color:${C.textMuted};}
  .select{background:${C.bg};border:1px solid ${C.border};border-radius:10px;color:${C.text};padding:11px 14px;font-size:14px;outline:none;font-family:Inter,sans-serif;appearance:none;cursor:pointer;transition:border-color .2s;width:100%;}
  .select:focus{border-color:${C.teal};}
  .tag{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:500;}
  .tab{padding:8px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:500;transition:all .2s;border:none;font-family:Inter,sans-serif;flex:1;}
  .tab-active{background:${C.teal};color:#000;}
  .tab-inactive{background:transparent;color:${C.textMuted};}
  .tab-inactive:hover{color:${C.text};}
  .progress-bar{height:6px;border-radius:3px;background:${C.border};overflow:hidden;}
  .progress-fill{height:100%;border-radius:3px;transition:width .6s cubic-bezier(.4,0,.2,1);}
  .macro-chip{background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:10px 12px;text-align:center;}
  .meal-row{background:${C.surfaceAlt};border:1px solid ${C.border};border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;transition:border-color .2s;}
  .meal-row:hover{border-color:${C.tealDim};}
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:flex-end;justify-content:center;padding:20px;}
  @media(min-width:640px){.overlay{align-items:center;}}
  .modal{background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;}
  .upload-zone{border:2px dashed ${C.border};border-radius:12px;padding:32px;text-align:center;cursor:pointer;transition:all .2s;}
  .upload-zone:hover,.upload-zone.drag-over{border-color:${C.teal};background:${C.tealGlow};}
  .food-suggestion{padding:10px 14px;border-radius:8px;cursor:pointer;transition:background .15s;display:flex;align-items:center;justify-content:space-between;}
  .food-suggestion:hover{background:${C.surfaceAlt};}
  .mounjaro-badge{background:linear-gradient(135deg,rgba(167,139,250,.2),rgba(167,139,250,.05));border:1px solid rgba(167,139,250,.3);border-radius:10px;padding:12px 14px;}
  .gfit-card{background:linear-gradient(135deg,rgba(66,133,244,.15),rgba(66,133,244,.03));border:1px solid rgba(66,133,244,.3);border-radius:14px;padding:18px;}
  .recalc-banner{background:linear-gradient(135deg,rgba(20,184,166,.2),rgba(20,184,166,.05));border:1px solid rgba(20,184,166,.4);border-radius:12px;padding:14px 16px;}
  .weight-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid ${C.border};}
  .weight-row:last-child{border-bottom:none;}
  .day-type-card{background:linear-gradient(135deg,rgba(20,184,166,.12),rgba(167,139,250,.08));border:1px solid rgba(20,184,166,.35);border-radius:16px;padding:20px;margin-bottom:16px;}
  .day-btn{flex:1;padding:16px 10px;border-radius:12px;border:2px solid transparent;cursor:pointer;font-family:Inter,sans-serif;font-weight:600;font-size:13px;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:6px;}
  .day-btn-gym{background:rgba(20,184,166,.1);color:${C.teal};border-color:rgba(20,184,166,.3);}
  .day-btn-gym:hover{background:rgba(20,184,166,.2);border-color:${C.teal};}
  .day-btn-rest{background:rgba(167,139,250,.1);color:${C.purple};border-color:rgba(167,139,250,.3);}
  .day-btn-rest:hover{background:rgba(167,139,250,.2);border-color:${C.purple};}
  .day-badge-gym{background:rgba(20,184,166,.15);border:1px solid rgba(20,184,166,.4);color:${C.teal};border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:5px;}
  .day-badge-rest{background:rgba(167,139,250,.15);border:1px solid rgba(167,139,250,.4);color:${C.purple};border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:5px;}

  .chat-bubble-user{background:${C.teal};color:#000;border-radius:18px 18px 4px 18px;padding:10px 14px;font-size:14px;max-width:82%;align-self:flex-end;line-height:1.5;}
  .chat-bubble-ai{background:${C.surface};border:1px solid ${C.border};color:${C.text};border-radius:18px 18px 18px 4px;padding:12px 14px;font-size:14px;max-width:88%;align-self:flex-start;line-height:1.6;}
  .chat-bubble-ai strong{color:${C.teal};}
  .chat-bubble-ai ul{padding-left:16px;margin:6px 0;}
  .chat-bubble-ai li{margin-bottom:3px;}
  .chat-input-bar{position:fixed;bottom:0;left:0;right:0;background:${C.surface};border-top:1px solid ${C.border};padding:12px 16px;display:flex;gap:8px;align-items:flex-end;z-index:50;max-width:480px;margin:0 auto;}
  .chat-send-btn{background:${C.teal};border:none;border-radius:10px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;flex-shrink:0;transition:all .2s;}
  .chat-send-btn:hover{background:#0d9488;}
  .chat-send-btn:disabled{opacity:.4;cursor:not-allowed;}
  .quick-chip{background:${C.surfaceAlt};border:1px solid ${C.border};border-radius:20px;padding:6px 12px;font-size:12px;color:${C.textDim};cursor:pointer;white-space:nowrap;transition:all .2s;font-family:Inter,sans-serif;}
  .quick-chip:hover{border-color:${C.teal};color:${C.teal};}
  .typing-dot{width:7px;height:7px;border-radius:50%;background:${C.textMuted};animation:typingBounce .9s infinite;}
  @keyframes typingBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
  .ring-container{position:relative;display:inline-flex;align-items:center;justify-content:center;}
  .ring-svg{transform:rotate(-90deg);}
  .ring-label{position:absolute;text-align:center;}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  @media(max-width:480px){.grid-2{grid-template-columns:1fr;}}
  .slide-in{animation:slideIn .3s ease;}
  @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .pulse{animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(20,184,166,.3)}50%{box-shadow:0 0 0 8px rgba(20,184,166,0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
`;

// ── Food Database ─────────────────────────────────────────────────────────────
const FOOD_DB = [
  // ── Eggs ──────────────────────────────────────────────────────────────────
  { name: "Egg (1 large, whole)", calories: 72, protein: 6, carbs: 0.4, fat: 5, fiber: 0, serving: "1 egg", tags: ["eggs","egg","boiled","raw","poached"] },
  { name: "Boiled Egg (1 large)", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, serving: "1 egg", tags: ["eggs","egg","boiled","hard boiled","soft boiled"] },
  { name: "Scrambled Eggs (2 eggs)", calories: 182, protein: 12, carbs: 2, fat: 13, fiber: 0, serving: "2 eggs cooked", tags: ["eggs","egg","scrambled"] },
  { name: "Fried Egg (1 large)", calories: 90, protein: 6.3, carbs: 0.4, fat: 7, fiber: 0, serving: "1 egg", tags: ["eggs","egg","fried"] },
  { name: "Omelet (2 eggs, plain)", calories: 185, protein: 13, carbs: 1, fat: 14, fiber: 0, serving: "2-egg omelet", tags: ["eggs","egg","omelet","omelette"] },
  { name: "Omelet with cheese (2 eggs)", calories: 250, protein: 16, carbs: 2, fat: 19, fiber: 0, serving: "2-egg omelet + cheese", tags: ["eggs","egg","omelet","omelette","cheese"] },
  { name: "Egg White (1 large)", calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0, serving: "1 egg white", tags: ["eggs","egg","white"] },
  { name: "Poached Egg (1 large)", calories: 72, protein: 6, carbs: 0.4, fat: 5, fiber: 0, serving: "1 egg", tags: ["eggs","egg","poached"] },
  // ── Chicken ───────────────────────────────────────────────────────────────
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, serving: "100g", tags: ["chicken","breast","grilled","baked"] },
  { name: "Grilled Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, serving: "100g", tags: ["chicken","breast","grilled"] },
  { name: "Chicken Thigh (100g)", calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, serving: "100g", tags: ["chicken","thigh"] },
  { name: "Rotisserie Chicken (100g)", calories: 190, protein: 28, carbs: 0, fat: 9, fiber: 0, serving: "100g", tags: ["chicken","rotisserie"] },
  // ── Fish & Seafood ────────────────────────────────────────────────────────
  { name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, serving: "100g", tags: ["fish","salmon"] },
  { name: "Tuna in water (1 can)", calories: 120, protein: 28, carbs: 0, fat: 0.5, fiber: 0, serving: "1 can ~140g", tags: ["fish","tuna","can"] },
  { name: "Shrimp (100g)", calories: 85, protein: 18, carbs: 0.9, fat: 1, fiber: 0, serving: "100g", tags: ["shrimp","seafood"] },
  // ── Dairy ─────────────────────────────────────────────────────────────────
  { name: "Greek Yogurt (200g)", calories: 130, protein: 22, carbs: 9, fat: 0.7, fiber: 0, serving: "200g", tags: ["yogurt","greek","dairy"] },
  { name: "Cottage Cheese (100g)", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, serving: "100g", tags: ["cottage","cheese","dairy"] },
  { name: "Whole Milk (200ml)", calories: 122, protein: 6.4, carbs: 9.6, fat: 6.4, fiber: 0, serving: "200ml", tags: ["milk","dairy"] },
  { name: "Cheddar Cheese (30g)", calories: 120, protein: 7.4, carbs: 0.4, fat: 9.9, fiber: 0, serving: "30g", tags: ["cheese","cheddar","dairy"] },
  { name: "Whey Protein Shake", calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 1, serving: "1 scoop", tags: ["protein","whey","shake","supplement"] },
  // ── Red Meat ──────────────────────────────────────────────────────────────
  { name: "Beef (100g lean)", calories: 215, protein: 26, carbs: 0, fat: 12, fiber: 0, serving: "100g", tags: ["beef","meat","steak"] },
  { name: "Ground Beef 80/20 (100g)", calories: 254, protein: 17, carbs: 0, fat: 20, fiber: 0, serving: "100g cooked", tags: ["beef","ground","burger","meat"] },
  { name: "Turkey Breast (100g)", calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, serving: "100g", tags: ["turkey","breast","meat"] },
  // ── Grains & Carbs ────────────────────────────────────────────────────────
  { name: "Brown Rice (100g cooked)", calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 1.8, serving: "100g cooked", tags: ["rice","brown","grain"] },
  { name: "White Rice (100g cooked)", calories: 206, protein: 4.3, carbs: 44, fat: 0.4, fiber: 0.6, serving: "100g cooked", tags: ["rice","white","grain"] },
  { name: "Oats (50g dry)", calories: 190, protein: 6.5, carbs: 33, fat: 3.5, fiber: 5, serving: "50g dry", tags: ["oats","oatmeal","porridge"] },
  { name: "Whole Wheat Bread (1 slice)", calories: 80, protein: 4, carbs: 14, fat: 1, fiber: 2, serving: "1 slice ~30g", tags: ["bread","wheat","toast"] },
  { name: "Pasta (100g cooked)", calories: 158, protein: 5.8, carbs: 31, fat: 0.9, fiber: 1.8, serving: "100g cooked", tags: ["pasta","noodles"] },
  // ── Legumes ───────────────────────────────────────────────────────────────
  { name: "Lentils (100g cooked)", calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, serving: "100g cooked", tags: ["lentils","legumes"] },
  { name: "Chickpeas (100g cooked)", calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, serving: "100g cooked", tags: ["chickpeas","hummus","legumes"] },
  { name: "Black Beans (100g cooked)", calories: 132, protein: 8.9, carbs: 24, fat: 0.5, fiber: 8.7, serving: "100g cooked", tags: ["beans","black","legumes"] },
  // ── Nuts & Seeds ──────────────────────────────────────────────────────────
  { name: "Almonds (30g)", calories: 173, protein: 6, carbs: 6, fat: 15, fiber: 3.5, serving: "30g", tags: ["almonds","nuts"] },
  { name: "Peanut Butter (2 tbsp)", calories: 190, protein: 8, carbs: 6, fat: 16, fiber: 2, serving: "2 tbsp ~32g", tags: ["peanut","butter","nuts"] },
  { name: "Walnuts (30g)", calories: 196, protein: 4.6, carbs: 4.1, fat: 19.6, fiber: 2, serving: "30g", tags: ["walnuts","nuts"] },
  // ── Vegetables ────────────────────────────────────────────────────────────
  { name: "Broccoli (100g)", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, serving: "100g", tags: ["broccoli","vegetable"] },
  { name: "Spinach (100g)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, serving: "100g", tags: ["spinach","greens","vegetable"] },
  { name: "Avocado (half)", calories: 160, protein: 2, carbs: 8.6, fat: 14.7, fiber: 6.7, serving: "half ~100g", tags: ["avocado"] },
  { name: "Sweet Potato (100g)", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, serving: "100g", tags: ["sweet potato","potato","vegetable"] },
  // ── Vegetables ────────────────────────────────────────────────────────────
  { name: "Cucumber (100g)", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, serving: "100g", tags: ["cucumber","vegetable","veg","salad"] },
  { name: "Tomato (1 medium)", calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, serving: "1 medium (123g)", tags: ["tomato","tomatoes","vegetable","salad"] },
  { name: "Lettuce / Mixed Greens (100g)", calories: 15, protein: 1.4, carbs: 2.2, fat: 0.2, fiber: 1.3, serving: "100g", tags: ["lettuce","salad","greens","mixed greens","leaves"] },
  { name: "Spinach (100g raw)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, serving: "100g", tags: ["spinach","vegetable","greens","salad"] },
  { name: "Broccoli (100g)", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, serving: "100g", tags: ["broccoli","vegetable","veg"] },
  { name: "Zucchini / Courgette (100g)", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, serving: "100g", tags: ["zucchini","courgette","vegetable","veg"] },
  { name: "Bell Pepper (1 medium)", calories: 31, protein: 1, carbs: 7.6, fat: 0.3, fiber: 2.5, serving: "1 medium (119g)", tags: ["bell pepper","pepper","capsicum","vegetable"] },
  { name: "Carrot (1 medium)", calories: 25, protein: 0.6, carbs: 5.8, fat: 0.1, fiber: 1.7, serving: "1 medium (61g)", tags: ["carrot","carrots","vegetable"] },
  { name: "Onion (1 medium)", calories: 44, protein: 1.2, carbs: 10.3, fat: 0.1, fiber: 1.9, serving: "1 medium (110g)", tags: ["onion","onions","vegetable"] },
  { name: "Garlic (1 clove)", calories: 4, protein: 0.2, carbs: 1, fat: 0, fiber: 0.1, serving: "1 clove (3g)", tags: ["garlic","clove","vegetable"] },
  { name: "Mushrooms (100g)", calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, serving: "100g", tags: ["mushroom","mushrooms","vegetable"] },
  { name: "Avocado (½ fruit)", calories: 120, protein: 1.5, carbs: 6.4, fat: 11, fiber: 5, serving: "½ avocado (68g)", tags: ["avocado","avo","fruit","healthy fat"] },
  { name: "Sweet Potato (1 medium, baked)", calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, serving: "1 medium (130g)", tags: ["sweet potato","yam","vegetable","carbs"] },
  { name: "Potato (1 medium, boiled)", calories: 87, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8, serving: "1 medium (136g)", tags: ["potato","potatoes","boiled potato","vegetable","carbs"] },
  // ── Fruit ─────────────────────────────────────────────────────────────────
  { name: "Banana (1 medium)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, serving: "1 medium", tags: ["banana","fruit"] },
  { name: "Apple (1 medium)", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, serving: "1 medium", tags: ["apple","fruit"] },
  { name: "Blueberries (100g)", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, serving: "100g", tags: ["blueberries","berries","fruit"] },
  { name: "Orange (1 medium)", calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1, serving: "1 medium (131g)", tags: ["orange","fruit","citrus"] },
  { name: "Strawberries (100g)", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, serving: "100g", tags: ["strawberry","strawberries","berries","fruit"] },
  { name: "Watermelon (200g)", calories: 60, protein: 1.2, carbs: 15.2, fat: 0.2, fiber: 0.8, serving: "200g (2 cups)", tags: ["watermelon","fruit","melon"] },
  { name: "Dates (3 dates)", calories: 69, protein: 0.6, carbs: 18.4, fat: 0, fiber: 1.9, serving: "3 dates (36g)", tags: ["dates","date","fruit","dried fruit"] },
  // ── Protein Supplements ───────────────────────────────────────────────────
  { name: "Dymatize ISO100 Whey Isolate (1 scoop)", calories: 110, protein: 25, carbs: 2, fat: 0.5, fiber: 0, serving: "1 scoop (31g)", tags: ["iso100","dymatize","isolate","whey","protein","shake","supplement"] },
  { name: "Quest Protein Bar – Chocolate Chip Cookie Dough", calories: 190, protein: 21, carbs: 25, fat: 8, fiber: 14, serving: "1 bar (60g)", tags: ["quest","protein bar","quest bar","chocolate chip","cookie dough"] },
  { name: "Quest Protein Bar – Cookies & Cream", calories: 190, protein: 21, carbs: 24, fat: 8, fiber: 14, serving: "1 bar (60g)", tags: ["quest","protein bar","quest bar","cookies cream"] },
  { name: "Quest Protein Bar – Double Chocolate Chunk", calories: 190, protein: 21, carbs: 23, fat: 9, fiber: 14, serving: "1 bar (60g)", tags: ["quest","protein bar","quest bar","chocolate"] },
  { name: "Quest Protein Bar – Birthday Cake", calories: 190, protein: 21, carbs: 25, fat: 8, fiber: 13, serving: "1 bar (60g)", tags: ["quest","protein bar","quest bar","birthday cake"] },
  // ── Almarai Products ──────────────────────────────────────────────────────
  { name: "Almarai Full Fat Milk (200ml)", calories: 130, protein: 6.4, carbs: 9.6, fat: 7.2, fiber: 0, serving: "200ml", tags: ["almarai","milk","full fat","dairy"] },
  { name: "Almarai Low Fat Milk (200ml)", calories: 90, protein: 7, carbs: 10, fat: 2.5, fiber: 0, serving: "200ml", tags: ["almarai","milk","low fat","skimmed","dairy"] },
  { name: "Almarai Skimmed Milk (200ml)", calories: 72, protein: 7, carbs: 10.5, fat: 0.4, fiber: 0, serving: "200ml", tags: ["almarai","milk","skimmed","dairy"] },
  { name: "Almarai Laban (200ml)", calories: 96, protein: 3.2, carbs: 5, fat: 5, fiber: 0, serving: "200ml", tags: ["almarai","laban","buttermilk","dairy"] },
  { name: "Almarai Greek Yogurt (150g)", calories: 100, protein: 10, carbs: 8, fat: 2, fiber: 0, serving: "150g", tags: ["almarai","greek yogurt","yogurt","dairy"] },
  { name: "Almarai Yogurt Plain (150g)", calories: 90, protein: 4.5, carbs: 8, fat: 3.5, fiber: 0, serving: "150g", tags: ["almarai","yogurt","plain","dairy"] },
  { name: "Almarai Fresh Orange Juice (200ml)", calories: 88, protein: 1.2, carbs: 20, fat: 0.2, fiber: 0.4, serving: "200ml", tags: ["almarai","orange juice","juice","fresh"] },
  { name: "Almarai Cheddar Cheese (30g)", calories: 114, protein: 7, carbs: 0.5, fat: 9.5, fiber: 0, serving: "30g", tags: ["almarai","cheddar","cheese","dairy"] },
  { name: "Almarai Cream Cheese (30g)", calories: 90, protein: 2.5, carbs: 1.5, fat: 8.5, fiber: 0, serving: "30g", tags: ["almarai","cream cheese","cheese","dairy"] },
  { name: "Almarai Butter (10g)", calories: 72, protein: 0.1, carbs: 0, fat: 8, fiber: 0, serving: "10g (1 tbsp)", tags: ["almarai","butter","dairy"] },
  // ── Nada Products ─────────────────────────────────────────────────────────
  { name: "Nada Full Fat Milk (200ml)", calories: 128, protein: 6.3, carbs: 9.5, fat: 7, fiber: 0, serving: "200ml", tags: ["nada","milk","full fat","dairy"] },
  { name: "Nada Low Fat Milk (200ml)", calories: 86, protein: 6.8, carbs: 9.8, fat: 2.2, fiber: 0, serving: "200ml", tags: ["nada","milk","low fat","dairy"] },
  { name: "Nada Laban (200ml)", calories: 96, protein: 3, carbs: 5, fat: 4.8, fiber: 0, serving: "200ml", tags: ["nada","laban","buttermilk","dairy"] },
  { name: "Nada Yogurt Plain (150g)", calories: 97, protein: 4, carbs: 12, fat: 3, fiber: 0, serving: "150g", tags: ["nada","yogurt","plain","dairy"] },
  { name: "Nada Orange Juice (200ml)", calories: 90, protein: 1, carbs: 21, fat: 0, fiber: 0.4, serving: "200ml", tags: ["nada","orange juice","juice"] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function calcProfileTargets(w, h, a, sex, activity, deficit, onMounjaro) {
  const actMult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  const bmr = sex === "male"
    ? 88.36 + 13.4 * w + 4.8 * h - 5.7 * a
    : 447.6 + 9.2 * w + 3.1 * h - 4.3 * a;
  const tdee = bmr * (actMult[activity] || 1.2);
  const bmi = w / ((h / 100) ** 2);

  // ── CALORIES ──────────────────────────────────────────────────────────────
  // Source: OMA/TOS/ASN/ACLM Joint Advisory (May 2025), AGA GLP-1 Clinical Practice Update
  //
  // On Mounjaro (tirzepatide), two constraints apply simultaneously:
  //   1. DEFICIT: TDEE minus a meaningful deficit to drive weight loss
  //   2. GI CEILING: Delayed gastric emptying at >2,000–2,500 kcal causes
  //      nausea, vomiting, and reflux — so intake must stay within GI tolerance
  //
  // The practical clinical target is therefore:
  //   - Start from TDEE − deficit
  //   - Then apply the GI ceiling: hard cap at 2,000 kcal (Mounjaro) / 2,500 (non)
  //   - Then apply the safety floor: never below BMR×0.85 or sex minimum
  //
  // Deficit: we use a moderate % of TDEE scaled by BMI (heavier patients can
  // safely sustain a larger deficit as fat stores are larger), capped at 1,000 kcal.

  let targetDeficit;
  if (onMounjaro) {
    if (bmi >= 50)      targetDeficit = Math.round(tdee * 0.28);
    else if (bmi >= 40) targetDeficit = Math.round(tdee * 0.23);
    else if (bmi >= 30) targetDeficit = Math.round(tdee * 0.18);
    else                targetDeficit = Math.round(tdee * 0.15);
    targetDeficit = Math.min(targetDeficit, 1000); // cap at 1,000 kcal
  } else {
    targetDeficit = parseInt(deficit) || 500;
  }

  const rawTarget = Math.round(tdee - targetDeficit);

  // GI tolerance ceiling (AGA/OMA): high caloric intake + delayed gastric emptying
  // → nausea, vomiting, reflux. Keep intake within GI-safe range.
  const giCeiling = onMounjaro ? 2000 : 2500;

  // Safety floor: never below 85% of BMR or sex-based minimum
  const sexFloor = sex === "male" ? 1500 : 1200;
  const safeFloor = Math.max(sexFloor, Math.round(bmr * 0.85));

  const targetCalories = Math.min(giCeiling, Math.max(safeFloor, rawTarget));

  // Gym days: +100 kcal to fuel workout, still within GI ceiling
  const gymCalories = Math.min(targetCalories + 100, giCeiling);

  // ── PROTEIN ───────────────────────────────────────────────────────────────
  // Source: OMA/TOS/ASN/ACLM Joint Advisory (May 2025, PMC12264624):
  //   "An absolute protein target of 80–120g/day may enhance adherence
  //    while ensuring adequate intake."
  //   "1.5g per kg lean body mass is more accurate but requires body composition data."
  //
  // At high BMI, using actual body weight grossly inflates the target.
  // We use adjusted body weight (IBW + 40% of excess) — standard clinical formula —
  // then clamp the result to the OMA absolute range of 100–130g.
  // This prevents the target from ever becoming unrealistically high.

  const heightInches = h / 2.54;
  const ibwRaw = sex === "male"
    ? 50 + 2.3 * (heightInches - 60)
    : 45.5 + 2.3 * (heightInches - 60);
  const adjBW = bmi > 30
    ? Math.round(ibwRaw + 0.4 * (w - ibwRaw))
    : w;

  // 1.2–1.5g/kg adjusted BW, clamped to OMA absolute range
  const gymProteinRaw = Math.round(Math.min(adjBW, w) * (onMounjaro ? 1.5 : 1.4));
  const restProteinRaw = Math.round(Math.min(adjBW, w) * (onMounjaro ? 1.2 : 1.0));

  // OMA absolute clamp: 80–120g rest days, 100–130g gym days
  const gymProtein = onMounjaro ? Math.min(gymProteinRaw, 130) : gymProteinRaw;
  const restProtein = onMounjaro ? Math.min(restProteinRaw, 120) : restProteinRaw;

  // Protein ranges: min (floor for low appetite days) and max (optimal for good days)
  // Min = OMA lower bound; Max = OMA upper, ~15–20g above target
  const gymProteinMin = onMounjaro ? Math.max(100, gymProtein - 20) : Math.max(80, gymProtein - 20);
  const gymProteinMax = onMounjaro ? Math.min(150, gymProtein + 20) : gymProtein + 20;
  const restProteinMin = onMounjaro ? Math.max(80, restProtein - 20) : Math.max(60, restProtein - 20);
  const restProteinMax = onMounjaro ? Math.min(140, restProtein + 20) : restProtein + 20;

  return {
    tdee: Math.round(tdee),
    bmr: Math.round(bmr),
    bmi: Math.round(bmi * 10) / 10,
    ibw: Math.round(ibwRaw),
    adjBW: Math.round(adjBW),
    targetCalories,
    gymCalories,
    gymProtein,
    gymProteinMin,
    gymProteinMax,
    restProtein,
    restProteinMin,
    restProteinMax,
    targetProtein: gymProtein,
    deficitUsed: targetDeficit,
    giCeiling,
    // Fiber: 38g men / 25g women (IoM/AGA). Critical on Mounjaro to counter
    // GLP-1-induced gut motility slowing and constipation risk.
    fiberTarget: sex === "male" ? 38 : 25,
  };
}

function getClaudeKey() { return localStorage.getItem("nt_claude_key") || ""; }
function getGeminiKey() { return localStorage.getItem("nt_gemini_key") || ""; }

const FOOD_JSON_SYS = `You are a precise nutritional database. Respond ONLY with valid JSON, no markdown, no extra text.
Format: {"name":"...","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"serving":"...","confidence":"high|medium|low","notes":"..."}
All numbers are per serving. Protein/carbs/fat/fiber in grams. Always include fiber even if 0.`;

async function analyzeFoodGemini(prompt, imageBase64) {
  const key = getGeminiKey();
  const parts = imageBase64
    ? [{ inline_data: { mime_type: "image/jpeg", data: imageBase64 } }, { text: FOOD_JSON_SYS + "\n\n" + prompt }]
    : [{ text: FOOD_JSON_SYS + "\n\n" + prompt }];
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`,
    { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] }) }
  );
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `Gemini error ${res.status}`); }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); } catch { return null; }
}

async function analyzeFoodClaude(prompt, imageBase64) {
  const key = getClaudeKey();
  const content = imageBase64
    ? [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } }, { type: "text", text: prompt }]
    : prompt;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1000, system: FOOD_JSON_SYS, messages: [{ role: "user", content }] }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `API error ${res.status}`); }
  const data = await res.json();
  const text = data.content.map(b => b.text || "").join("");
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); } catch { return null; }
}

async function analyzeFood(prompt, imageBase64) {
  const geminiKey = getGeminiKey();
  const claudeKey = getClaudeKey();
  if (!geminiKey && !claudeKey) throw new Error("NO_KEY");
  // Prefer Gemini (free), fall back to Claude
  if (geminiKey) return analyzeFoodGemini(prompt, imageBase64);
  return analyzeFoodClaude(prompt, imageBase64);
}

function detectMealType() {
  const h = new Date().getHours();
  if (h < 10) return "Breakfast";
  if (h < 13) return "Morning Snack";
  if (h < 15) return "Lunch";
  if (h < 18) return "Afternoon Snack";
  return "Dinner";
}

function getMounjaroWeek(startDate) {
  if (!startDate) return null;
  const days = Math.floor((Date.now() - new Date(startDate + "T00:00:00").getTime()) / 86400000);
  return Math.max(1, Math.floor(days / 7) + 1);
}

// ── Ring ──────────────────────────────────────────────────────────────────────
function Ring({ value, max, size = 120, stroke = 10, color = C.teal, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / (max || 1), 1);
  const offset = circ * (1 - pct);
  const isOver = pct >= 1;
  const isNear = pct >= 0.9 && !isOver;
  return (
    <div className={`ring-container${isNear ? " pulse" : ""}`} style={{ width: size, height: size }}>
      <svg className="ring-svg" width={size} height={size}>
        <circle fill="none" stroke={C.border} cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle fill="none" stroke={isOver ? C.amber : color} cx={size / 2} cy={size / 2} r={r}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  );
}

// ── Weight Chart ──────────────────────────────────────────────────────────────
function WeightChart({ entries }) {
  if (!entries || entries.length < 2) return null;
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-12);
  const vals = sorted.map(e => e.kg);
  const minV = Math.min(...vals) - 0.5, maxV = Math.max(...vals) + 0.5;
  const W = 340, H = 90, P = 10;
  const x = i => P + (i / (sorted.length - 1)) * (W - P * 2);
  const y = v => H - P - ((v - minV) / (maxV - minV)) * (H - P * 2);
  const pts = sorted.map((e, i) => `${x(i)},${y(e.kg)}`).join(" ");
  const area = `M ${sorted.map((e, i) => `${x(i)},${y(e.kg)}`).join(" L ")} L ${x(sorted.length - 1)},${H} L ${P},${H} Z`;
  const lost = Math.round((sorted[0].kg - sorted[sorted.length - 1].kg) * 10) / 10;
  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.teal} stopOpacity=".3" />
            <stop offset="100%" stopColor={C.teal} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#wg)" />
        <polyline points={pts} fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {sorted.map((e, i) => <circle key={i} cx={x(i)} cy={y(e.kg)} r="3" fill={C.teal} />)}
        <text x={x(0)} y={H + 12} fill={C.textMuted} fontSize="9" textAnchor="middle">{sorted[0].date.slice(5)}</text>
        <text x={x(sorted.length - 1)} y={H + 12} fill={C.textMuted} fontSize="9" textAnchor="middle">{sorted[sorted.length - 1].date.slice(5)}</text>
      </svg>
      {lost > 0 && <div style={{ fontSize: 12, color: C.green, marginTop: 14, fontWeight: 600 }}>📉 Lost {lost} kg over tracked period</div>}
    </div>
  );
}

// ── Google Fit Hook ───────────────────────────────────────────────────────────
function useGoogleFit() {
  const isConfigured = GFIT_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE";
  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem("gfit_token") || null);
  const [status, setStatus] = useState(accessToken ? "connected" : "idle");
  const [lastSynced, setLastSynced] = useState(() => localStorage.getItem("gfit_last_synced") || null);

  const signIn = async () => {
    if (!isConfigured) return null;
    setStatus("loading");
    try {
      await new Promise((res, rej) => {
        if (window.google?.accounts) { res(); return; }
        const s = document.createElement("script");
        s.src = "https://accounts.google.com/gsi/client";
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
      return new Promise(resolve => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GFIT_CLIENT_ID, scope: GFIT_SCOPE,
          callback: resp => {
            if (resp.access_token) {
              setAccessToken(resp.access_token);
              sessionStorage.setItem("gfit_token", resp.access_token);
              setStatus("connected"); resolve(resp.access_token);
            } else { setStatus("error"); resolve(null); }
          },
        });
        client.requestAccessToken();
      });
    } catch { setStatus("error"); return null; }
  };

  const fetchWeightHistory = async (token) => {
    const t = token || accessToken;
    if (!t) return null;
    const endMs = Date.now(), startMs = endMs - 180 * 86400000;
    try {
      const res = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
        method: "POST",
        headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          aggregateBy: [{ dataTypeName: "com.google.weight" }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startMs, endTimeMillis: endMs,
        }),
      });
      if (!res.ok) { setStatus("error"); return null; }
      const data = await res.json();
      const entries = [];
      for (const bucket of data.bucket || []) {
        for (const ds of bucket.dataset || []) {
          for (const pt of ds.point || []) {
            const kg = pt.value?.[0]?.fpVal;
            if (kg) entries.push({ date: new Date(+bucket.startTimeMillis).toISOString().split("T")[0], kg: Math.round(kg * 10) / 10 });
          }
        }
      }
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLastSynced(now); localStorage.setItem("gfit_last_synced", now);
      setStatus("connected"); return entries;
    } catch { setStatus("error"); return null; }
  };

  const disconnect = () => { setAccessToken(null); sessionStorage.removeItem("gfit_token"); setStatus("idle"); };
  return { status, signIn, fetchWeightHistory, disconnect, isConnected: !!accessToken, isConfigured, lastSynced, accessToken };
}

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: "", weight: "", height: "", age: "", sex: "male", activity: "sedentary", onMounjaro: true, mounjaroStartDate: "", targetCalorieDeficit: "500" });
  const [claudeKey, setClaudeKey] = useState(() => localStorage.getItem("nt_claude_key") || "");
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("nt_gemini_key") || "");
  const up = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const saveClaudeKey = (v) => { setClaudeKey(v); localStorage.setItem("nt_claude_key", v.trim()); };
  const saveGeminiKey = (v) => { setGeminiKey(v); localStorage.setItem("nt_gemini_key", v.trim()); };

  const getTargets = () => calcProfileTargets(parseFloat(f.weight), parseFloat(f.height), parseFloat(f.age), f.sex, f.activity, f.targetCalorieDeficit, f.onMounjaro);

  const steps = [
    {
      title: "Welcome to NutriTrack", subtitle: "Let's set up your profile",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="input" placeholder="Your name" value={f.name} onChange={e => up("name", e.target.value)} />
          <div className="grid-2">
            <div>
              <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 4 }}>Weight <span style={{ color: C.teal, fontWeight: 600 }}>in kg</span></label>
              <input className="input" type="number" placeholder="e.g. 95" value={f.weight} onChange={e => up("weight", e.target.value)} />
              {f.weight && parseFloat(f.weight) > 250 && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>⚠️ Over 250kg — did you enter lbs by mistake?</div>}
              {f.weight && parseFloat(f.weight) < 40 && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>⚠️ Under 40kg — please check your entry</div>}
              {f.weight && parseFloat(f.weight) >= 40 && parseFloat(f.weight) <= 250 && (
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{(parseFloat(f.weight) * 2.205).toFixed(0)} lbs</div>
              )}
            </div>
            <div>
              <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 4 }}>Height <span style={{ color: C.teal, fontWeight: 600 }}>in cm</span></label>
              <input className="input" type="number" placeholder="e.g. 175" value={f.height} onChange={e => up("height", e.target.value)} />
              {f.height && parseFloat(f.height) < 100 && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>⚠️ Under 100cm — did you enter feet?</div>}
              {f.height && parseFloat(f.height) >= 100 && (
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{Math.floor(parseFloat(f.height) / 30.48)}'{Math.round((parseFloat(f.height) % 30.48) / 2.54)}"</div>
              )}
            </div>
          </div>
          <div className="grid-2">
            <div><label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 4 }}>Age</label>
              <input className="input" type="number" placeholder="35" value={f.age} onChange={e => up("age", e.target.value)} /></div>
            <div><label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 4 }}>Sex</label>
              <select className="select" value={f.sex} onChange={e => up("sex", e.target.value)}>
                <option value="male">Male</option><option value="female">Female</option>
              </select></div>
          </div>
        </div>
      ),
      canNext: () => f.name && f.weight && f.height && f.age,
    },
    {
      title: "Activity & Goals", subtitle: "Helps calculate your calorie targets",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 4 }}>Activity Level</label>
            <select className="select" value={f.activity} onChange={e => up("activity", e.target.value)}>
              <option value="sedentary">Sedentary (desk job, no exercise)</option>
              <option value="light">Light (1–3x/week)</option>
              <option value="moderate">Moderate (3–5x/week)</option>
              <option value="active">Active (6–7x/week)</option>
            </select></div>
          <div><label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 4 }}>Calorie deficit</label>
            <select className="select" value={f.targetCalorieDeficit} onChange={e => up("targetCalorieDeficit", e.target.value)}>
              <option value="300">Gentle (−300 kcal) ~0.3 kg/week</option>
              <option value="500">Standard (−500 kcal) ~0.5 kg/week</option>
              <option value="750">Moderate (−750 kcal) ~0.75 kg/week</option>
            </select></div>
        </div>
      ),
      canNext: () => true,
    },
    {
      title: "Mounjaro Settings", subtitle: "Tirzepatide affects nutrition needs",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="mounjaro-badge">
            <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, marginBottom: 4 }}>💉 Mounjaro (Tirzepatide)</div>
            <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>Mounjaro reduces appetite significantly. Protein targets are raised to protect muscle during rapid weight loss. The app reminds you to hit protein even when not hungry.</div>
          </div>
          <div><label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>Are you on Mounjaro?</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Yes", "No"].map(opt => (
                <button key={opt} onClick={() => up("onMounjaro", opt === "Yes")}
                  style={{ flex: 1, padding: 10, borderRadius: 8, cursor: "pointer", fontFamily: "Inter,sans-serif", fontWeight: 500, border: `1px solid ${f.onMounjaro === (opt === "Yes") ? C.purple : C.border}`, background: f.onMounjaro === (opt === "Yes") ? "rgba(167,139,250,.15)" : "transparent", color: f.onMounjaro === (opt === "Yes") ? C.purple : C.textDim }}>
                  {opt}
                </button>
              ))}
            </div></div>
          {f.onMounjaro && (
            <div>
              <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 4 }}>When did you start Mounjaro?</label>
              <input className="input" type="date" max={new Date().toISOString().split("T")[0]} value={f.mounjaroStartDate} onChange={e => up("mounjaroStartDate", e.target.value)} />
              {f.mounjaroStartDate && (() => {
                const days = Math.floor((Date.now() - new Date(f.mounjaroStartDate + "T00:00:00").getTime()) / 86400000);
                const week = Math.max(1, Math.floor(days / 7) + 1);
                return <div style={{ fontSize: 12, color: C.purple, marginTop: 6 }}>📅 That makes you <strong>Week {week}</strong> — the app will keep this updated automatically, no need to change it yourself.</div>;
              })()}
            </div>
          )}
        </div>
      ),
      canNext: () => true,
    },
    {
      title: "Your Targets", subtitle: "Based on your data — gym vs rest day",
      content: (() => {
        const t = getTargets();
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: C.bg, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 10 }}>🏋️ Gym Days</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="macro-chip"><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: C.teal }}>{t.gymCalories}</div><div style={{ fontSize: 10, color: C.textMuted }}>kcal</div></div>
                <div className="macro-chip"><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: C.amber }}>{t.gymProtein}g</div><div style={{ fontSize: 10, color: C.textMuted }}>protein (1.5g/kg)</div></div>
              </div>
            </div>
            <div style={{ background: C.bg, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, marginBottom: 10 }}>😴 Rest Days</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="macro-chip"><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: C.purple }}>{t.targetCalories}</div><div style={{ fontSize: 10, color: C.textMuted }}>kcal</div></div>
                <div className="macro-chip"><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: C.purple }}>{t.restProtein}g</div><div style={{ fontSize: 10, color: C.textMuted }}>protein (1.2g/kg)</div></div>
              </div>
            </div>
            {f.onMounjaro && (
              <div className="mounjaro-badge">
                <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>
                  💉 <strong style={{ color: C.purple }}>SURMOUNT-1 protocol:</strong> Your calorie target = TDEE − 500 kcal, personalised to your weight. Floored at your BMR so you never go below what your body needs. Heavier users get a proportionally higher target — not a one-size-fits-all number.
                </div>
              </div>
            )}
            {(() => {
              const t = getTargets();
              if (t.targetCalories > 3000) return (
                <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: 12, fontSize: 12, color: C.red }}>
                  ⚠️ Your calorie target seems very high ({t.targetCalories} kcal). Please go back and double-check your weight is in <strong>kg</strong>, not lbs. For reference: 200 lbs = 91 kg.
                </div>
              );
              if (t.gymProtein > 200) return (
                <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: 12, fontSize: 12, color: C.red }}>
                  ⚠️ Protein target is very high ({t.gymProtein}g). Please verify your weight is in <strong>kg</strong>, not lbs.
                </div>
              );
              return null;
            })()}
          </div>
        );
      })(),
      canNext: () => true,
    },
    {
      title: "AI API Key", subtitle: "Powers photo scanning & AI chat",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Gemini — recommended (free) */}
          <div style={{ padding: "12px 14px", background: "rgba(20,184,166,.06)", border: `1px solid ${geminiKey ? C.teal : "rgba(20,184,166,.2)"}`, borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 6 }}>
              🟢 Google Gemini <span style={{ fontSize: 11, fontWeight: 400, color: C.textDim }}>(Free — recommended)</span>
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, lineHeight: 1.6 }}>
              1,500 free scans/day · No credit card needed<br/>
              Get key: <strong style={{ color: C.teal }}>aistudio.google.com/apikey</strong>
            </div>
            <input className="input" type="password" placeholder="AIza…"
              value={geminiKey} onChange={e => saveGeminiKey(e.target.value)} />
            {geminiKey && <div style={{ fontSize: 11, color: C.teal, marginTop: 6 }}>✓ Gemini key saved</div>}
          </div>
          {/* Claude — paid fallback */}
          <div style={{ padding: "12px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>
              Claude (Anthropic) <span style={{ fontSize: 11, fontWeight: 400, color: C.textDim }}>(Paid, used if no Gemini key)</span>
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>
              Get key: <strong>console.anthropic.com</strong> → API Keys
            </div>
            <input className="input" type="password" placeholder="sk-ant-api03-…"
              value={claudeKey} onChange={e => saveClaudeKey(e.target.value)} />
            {claudeKey && <div style={{ fontSize: 11, color: C.teal, marginTop: 6 }}>✓ Claude key saved</div>}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, textAlign: "center" }}>Keys are stored only on this device and never shared.</div>
        </div>
      ),
      canNext: () => true,
    },
    {
      title: "Backup & Restore", subtitle: "Keep your data safe across devices",
      content: (() => {
        const lastBackup = localStorage.getItem("nt_last_backup");
        const lastBackupStr = lastBackup
          ? new Date(parseInt(lastBackup)).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
          : "Never";
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ padding: "12px 14px", background: "rgba(20,184,166,.06)", border: "1px solid rgba(20,184,166,.2)", borderRadius: 10, fontSize: 12, lineHeight: 1.8, color: C.textMuted }}>
              💾 Your data (logs, weight, profile, My Foods) is stored on this device only.<br/>
              Export a backup file to keep a copy or move to a new device.
            </div>
            {/* Export */}
            <div>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 8 }}>Last backup: <strong style={{ color: lastBackup ? C.teal : C.amber }}>{lastBackupStr}</strong></div>
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => {
                const data = {
                  version: 1, exportedAt: new Date().toISOString(),
                  profile: JSON.parse(localStorage.getItem("nt_profile") || "null"),
                  logs: JSON.parse(localStorage.getItem("nt_logs") || "{}"),
                  dayTypes: JSON.parse(localStorage.getItem("nt_day_types") || "{}"),
                  weightHistory: JSON.parse(localStorage.getItem("nt_weight_history") || "[]"),
                  myFoods: JSON.parse(localStorage.getItem("nt_my_foods") || "[]"),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url;
                a.download = `nutritrack-backup-${new Date().toISOString().split("T")[0]}.json`;
                a.click(); URL.revokeObjectURL(url);
                localStorage.setItem("nt_last_backup", Date.now().toString());
              }}>💾 Download Backup</button>
            </div>
            {/* Import */}
            <div>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 8 }}>Restore from a previous backup file:</div>
              <label style={{ display: "block", padding: "12px 16px", background: C.bg, border: `1px dashed ${C.border}`, borderRadius: 10, textAlign: "center", cursor: "pointer", fontSize: 13, color: C.textMuted }}>
                📂 Choose backup file to restore
                <input type="file" accept=".json" style={{ display: "none" }} onChange={e => {
                  const file = e.target.files?.[0]; if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    try {
                      const data = JSON.parse(ev.target.result);
                      if (!data.version || !data.profile) { alert("Invalid backup file."); return; }
                      if (window.confirm(`Restore backup from ${data.exportedAt?.split("T")[0]}? This will replace your current data.`)) {
                        if (data.profile) localStorage.setItem("nt_profile", JSON.stringify(data.profile));
                        if (data.logs) localStorage.setItem("nt_logs", JSON.stringify(data.logs));
                        if (data.dayTypes) localStorage.setItem("nt_day_types", JSON.stringify(data.dayTypes));
                        if (data.weightHistory) localStorage.setItem("nt_weight_history", JSON.stringify(data.weightHistory));
                        if (data.myFoods) localStorage.setItem("nt_my_foods", JSON.stringify(data.myFoods));
                        localStorage.setItem("nt_last_backup", Date.now().toString());
                        window.location.reload();
                      }
                    } catch { alert("Could not read backup file."); }
                  };
                  reader.readAsText(file);
                }} />
              </label>
            </div>
            <div style={{ fontSize: 11, color: C.textDim, textAlign: "center", lineHeight: 1.6 }}>
              The app will remind you to back up every 24 hours.
            </div>
          </div>
        );
      })(),
      canNext: () => true,
    },
  ];

  const cur = steps[step];
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🥗</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>NutriTrack</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Your Mounjaro companion</div>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
            {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? C.teal : C.border, transition: "background .3s" }} />)}
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Step {step + 1} of {steps.length}</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{cur.title}</h2>
          <p style={{ fontSize: 13, color: C.textDim, marginBottom: 22 }}>{cur.subtitle}</p>
          {cur.content}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            {step > 0 && <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>Back</button>}
            {step < steps.length - 1
              ? <button className="btn-primary" style={{ flex: 1 }} disabled={!cur.canNext()} onClick={() => setStep(s => s + 1)}>Continue →</button>
              : <button className="btn-primary" style={{ flex: 1 }} onClick={() => { const t = getTargets(); onComplete({ ...f, ...t }); }}>Start Tracking ✓</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Quantity Picker ───────────────────────────────────────────────────────────
function QuantityPicker({ food, onConfirm, onBack }) {
  const [qty, setQty] = useState(1);
  const [customQty, setCustomQty] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const amount = useCustom ? (parseFloat(customQty) || 1) : qty;
  const scaled = {
    calories: Math.round(food.calories * amount),
    protein: Math.round(food.protein * amount * 10) / 10,
    carbs: Math.round((food.carbs || 0) * amount * 10) / 10,
    fat: Math.round((food.fat || 0) * amount * 10) / 10,
    fiber: Math.round((food.fiber || 0) * amount * 10) / 10,
  };

  const quickQtys = [0.5, 1, 1.5, 2, 3];

  return (
    <div className="slide-in">
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter,sans-serif" }}>
        ← Back
      </button>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{food.name}</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Base serving: {food.serving}</div>

      {/* Quick qty buttons */}
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, fontWeight: 500 }}>Quantity (× servings)</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {quickQtys.map(q => (
          <button key={q} onClick={() => { setQty(q); setUseCustom(false); }}
            style={{ flex: 1, padding: "10px 4px", borderRadius: 8, border: `1px solid ${!useCustom && qty === q ? C.teal : C.border}`,
              background: !useCustom && qty === q ? "rgba(20,184,166,.15)" : "transparent",
              color: !useCustom && qty === q ? C.teal : C.textDim, cursor: "pointer", fontFamily: "JetBrains Mono,monospace", fontSize: 13, fontWeight: 600 }}>
            {q}×
          </button>
        ))}
      </div>

      {/* Custom qty */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
        <input className="input" type="number" placeholder="Custom (e.g. 2.5)" value={customQty}
          onChange={e => { setCustomQty(e.target.value); setUseCustom(true); }}
          onFocus={() => setUseCustom(true)}
          style={{ flex: 1, borderColor: useCustom ? C.teal : C.border }} />
        <span style={{ fontSize: 12, color: C.textMuted, whiteSpace: "nowrap" }}>× servings</span>
      </div>

      {/* Scaled macros preview */}
      <div className="card-alt" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
          You'll log: <strong style={{ color: C.text }}>{amount}× {food.serving}</strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {[["Calories", scaled.calories, "kcal", C.teal], ["Protein", scaled.protein, "g", C.amber], ["Carbs", scaled.carbs, "g", C.green], ["Fat", scaled.fat, "g", C.red], ["Fiber", scaled.fiber, "g", "#f97316"]].map(([l, v, u, c]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: c }}>{v}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{u}</div>
              <div style={{ fontSize: 10, color: C.textDim }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" style={{ width: "100%" }}
        onClick={() => onConfirm({ ...food, ...scaled, serving: `${amount}× ${food.serving}`, quantity: amount })}>
        Add {amount}× to Log ✓
      </button>
    </div>
  );
}

// ── Add Food Modal ────────────────────────────────────────────────────────────
function AddFoodModal({ onAdd, onClose }) {
  const [tab, setTab] = useState("search");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pendingFood, setPendingFood] = useState(null); // food waiting for quantity selection
  const [manual, setManual] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "", fiber: "", serving: "1 serving" });
  const [dragOver, setDragOver] = useState(false);
  const [savedFoodMsg, setSavedFoodMsg] = useState("");
  const fileRef = useRef();
  const debounceRef = useRef();

  // ── My Foods helpers ───────────────────────────────────────────────────────
  const getMyFoods = () => { try { return JSON.parse(localStorage.getItem("nt_my_foods") || "[]"); } catch { return []; } };
  const saveToMyFoods = (food) => {
    const existing = getMyFoods();
    const key = food.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
    if (existing.some(f => f.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25) === key)) {
      setSavedFoodMsg("Already in My Foods ✓"); setTimeout(() => setSavedFoodMsg(""), 2000); return;
    }
    const item = { ...food, id: Date.now(), source: "myfood", tags: food.tags || [] };
    localStorage.setItem("nt_my_foods", JSON.stringify([item, ...existing].slice(0, 200)));
    setSavedFoodMsg("⭐ Saved to My Foods!"); setTimeout(() => setSavedFoodMsg(""), 2500);
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.length < 2) { setSuggestions([]); return; }
    // Immediate local results — My Foods first, then FOOD_DB
    const q = query.toLowerCase();
    const keywords = q.split(/\s+/).filter(k => k.length > 1);
    const matchFn = f => {
      const name = f.name.toLowerCase();
      const tags = (f.tags || []).join(" ");
      return name.includes(q) || tags.includes(q) ||
        keywords.some(kw => name.includes(kw) || tags.includes(kw));
    };
    const mine = getMyFoods().filter(matchFn).slice(0, 3).map(f => ({ ...f, source: "myfood" }));
    const local = FOOD_DB.filter(matchFn).slice(0, 4);
    setSuggestions([...mine, ...local.map(f => ({ ...f, source: "database" }))]);

    // Debounced: Gemini multi-result search (or AI single-item fallback)
    debounceRef.current = setTimeout(async () => {
      if (local.length >= 4) return; // local results are sufficient
      const aiKey = getGeminiKey() || getClaudeKey();
      if (!aiKey) return; // no key — just show local results
      setAiLoading(true);
      try {
        const geminiKey = getGeminiKey();
        let aiFoods = [];
        if (geminiKey) {
          // Ask Gemini for multiple matching foods at once
          const prompt = `List up to 6 foods that best match the search: "${query}".
Include generic foods, branded products, and regional variants.
Return ONLY a JSON array, no markdown. Each item:
{"name":"...","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"serving":"..."}
Per-serving values. Numbers only (no units in values). Fiber 0 if unknown.`;
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
            { method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
          );
          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            try {
              const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
              aiFoods = (Array.isArray(parsed) ? parsed : [parsed])
                .filter(f => f && f.calories > 0)
                .map(f => ({ ...f, source: "ai" }));
            } catch {}
          }
        } else {
          // Claude fallback — single item
          const r = await analyzeFood(`Food item: "${query}". Accurate nutritional info per standard serving.`);
          if (r) aiFoods = [{ ...r, source: "ai" }];
        }

        if (aiFoods.length > 0) {
          setSuggestions(prev => {
            const combined = [...prev, ...aiFoods];
            const seen = new Set();
            return combined.filter(f => {
              const key = f.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 22);
              if (seen.has(key)) return false;
              seen.add(key); return true;
            }).slice(0, 8);
          });
        }
      } catch {}
      setAiLoading(false);
    }, 500);
  }, [query]);

  const handleImage = async (file) => {
    setAiError(null);
    setAiResult(null);
    const reader = new FileReader();
    reader.onload = async e => {
      const b64 = e.target.result.split(",")[1];
      setImagePreview(e.target.result);
      setAiLoading(true);
      try {
        const r = await analyzeFood("Analyze this food/product image. Identify the exact product if packaged (read the label). Return accurate nutritional info per serving.", b64);
        if (r) setAiResult(r);
        else setAiError("Couldn't read nutrition info from this image. Try a clearer photo of the label.");
      } catch (err) {
        if (err.message === "NO_KEY") {
          setAiError("NO_KEY");
        } else {
          setAiError("API error: " + err.message + ". Check your Claude API key in Settings.");
        }
        setImagePreview(null);
      }
      setAiLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Step 1: user picks a food → go to quantity picker
  const selectFood = food => setPendingFood(food);

  // Step 2: user confirms quantity → log it
  const confirmFood = food => {
    onAdd({ ...food, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), mealType: detectMealType() });
    onClose();
  };

  const submitManual = () => {
    if (!manual.name || !manual.calories) return;
    confirmFood({ name: manual.name, calories: +manual.calories || 0, protein: +manual.protein || 0, carbs: +manual.carbs || 0, fat: +manual.fat || 0, fiber: +manual.fiber || 0, serving: manual.serving });
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal slide-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Log Food</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 22 }}>×</button>
        </div>

        {/* Quantity picker — shown after selecting any food */}
        {pendingFood ? (
          <QuantityPicker food={pendingFood} onConfirm={confirmFood} onBack={() => setPendingFood(null)} />
        ) : (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 20, background: C.bg, padding: 4, borderRadius: 10 }}>
              {[["search", "🔍 Search"], ["photo", "📷 Photo"], ["manual", "✏️ Manual"]].map(([id, label]) => (
                <button key={id} className={`tab ${tab === id ? "tab-active" : "tab-inactive"}`} onClick={() => setTab(id)}>{label}</button>
              ))}
            </div>

            {tab === "search" && (
              <div>
                <input className="input" placeholder="e.g. eggs, chicken breast, protein bar…" value={query} onChange={e => setQuery(e.target.value)} autoFocus />
                {aiLoading && <div style={{ fontSize: 12, color: C.teal, marginTop: 8 }}><span className="spin">⚡</span> Looking up nutrition data…</div>}
                {suggestions.length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Tap to select, then set quantity →</div>
                    {suggestions.map((s, i) => (
                      <div key={i} className="food-suggestion" onClick={() => selectFood(s)}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>{s.serving} · {s.source === "myfood" ? <span style={{ color: "#f59e0b" }}>⭐ My Foods</span> : s.source === "ai" ? "🤖 AI" : s.source === "off" ? "🌍 Open Foods" : "📋 DB"}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="mono" style={{ fontSize: 14, color: C.teal }}>{s.calories} kcal</div>
                          <div style={{ fontSize: 11, color: C.amber }}>{s.protein}g protein</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {query.length >= 2 && suggestions.length === 0 && !aiLoading && (
                  <div style={{ textAlign: "center", padding: "20px 0", color: C.textMuted, fontSize: 13 }}>No results. Try Photo or Manual.</div>
                )}
              </div>
            )}

            {tab === "photo" && (
              <div>
                {/* No API key warning */}
                {!getClaudeKey() && !getGeminiKey() && (
                  <div style={{ marginBottom: 14, padding: "12px 14px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: 12, lineHeight: 1.7, color: C.textMuted }}>
                    ⚠️ <strong style={{ color: C.red }}>API key required</strong> for photo analysis.<br/>
                    Tap <strong>Settings</strong> → add a free <strong style={{ color: C.teal }}>Google Gemini key</strong> (aistudio.google.com/apikey).
                  </div>
                )}
                {/* API / analysis error */}
                {aiError && aiError !== "NO_KEY" && (
                  <div style={{ marginBottom: 14, padding: "12px 14px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: 12, color: C.red }}>
                    ❌ {aiError}
                  </div>
                )}
                {!imagePreview ? (
                  <div>
                    {/* Two explicit buttons — more reliable than hidden input in sandboxed iframe */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                      <label style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
                        background: "rgba(20,184,166,.08)", border: `1px solid rgba(20,184,166,.3)`,
                        borderRadius: 12, cursor: "pointer", transition: "all .2s"
                      }}>
                        <span style={{ fontSize: 28 }}>📷</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.teal }}>Take a Photo</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>Opens camera on mobile</div>
                        </div>
                        <input type="file" accept="image/*" capture="environment"
                          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                          onChange={e => e.target.files[0] && handleImage(e.target.files[0])} />
                      </label>

                      <label style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
                        background: C.surfaceAlt, border: `1px solid ${C.border}`,
                        borderRadius: 12, cursor: "pointer", transition: "all .2s"
                      }}>
                        <span style={{ fontSize: 28 }}>🖼️</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Upload from Gallery</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>Choose an existing photo</div>
                        </div>
                        <input type="file" accept="image/*"
                          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                          onChange={e => e.target.files[0] && handleImage(e.target.files[0])} />
                      </label>
                    </div>

                    {/* Drag & drop zone */}
                    <div className={`upload-zone${dragOver ? " drag-over" : ""}`}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); const fl = e.dataTransfer.files[0]; if (fl?.type.startsWith("image/")) handleImage(fl); }}
                      style={{ padding: "18px", marginBottom: 0 }}>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>⬆️</div>
                      <div style={{ fontSize: 13, color: C.textMuted }}>Or drag & drop an image here</div>
                    </div>

                    {/* Sandbox notice */}
                    <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.2)", borderRadius: 8, fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>
                      💡 <strong style={{ color: C.amber }}>Tip:</strong> If photo upload doesn't work here, use the <strong>Search tab</strong> instead — type the product name and the AI will look up the exact nutrition info. For best results with packaged food, type the brand and product name (e.g. "Quest Chocolate Chip Cookie Dough Bar").
                    </div>
                  </div>
                ) : (
                  <div>
                    <img src={imagePreview} alt="food" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 12, marginBottom: 16 }} />
                    {aiLoading && <div style={{ textAlign: "center", padding: "20px 0" }}><div style={{ fontSize: 24, marginBottom: 8 }}>🤖</div><div style={{ fontSize: 13, color: C.teal }}>Analyzing nutrition data…</div></div>}
                    {aiResult && !aiLoading && (
                      <div className="slide-in">
                        <div className="card-alt" style={{ padding: 16, marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 600 }}>{aiResult.name}</div>
                              <div style={{ fontSize: 12, color: C.textMuted }}>{aiResult.serving}</div>
                            </div>
                            <span className="tag" style={{ background: "rgba(20,184,166,.1)", color: C.teal, fontSize: 11 }}>
                              {aiResult.confidence === "high" ? "✓ High" : aiResult.confidence === "medium" ? "~ Med" : "? Low"}
                            </span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                            {[["Calories", aiResult.calories, "kcal", C.teal], ["Protein", aiResult.protein, "g", C.amber], ["Carbs", aiResult.carbs, "g", C.green], ["Fat", aiResult.fat, "g", C.red], ["Fiber", aiResult.fiber || 0, "g", "#f97316"]].map(([l, v, u, c]) => (
                              <div key={l} style={{ textAlign: "center" }}>
                                <div className="mono" style={{ fontSize: 15, fontWeight: 600, color: c }}>{v}</div>
                                <div style={{ fontSize: 10, color: C.textMuted }}>{u}</div>
                                <div style={{ fontSize: 10, color: C.textDim }}>{l}</div>
                              </div>
                            ))}
                          </div>
                          {aiResult.notes && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>{aiResult.notes}</div>}
                        </div>
                        <button className="btn-primary" style={{ width: "100%" }} onClick={() => selectFood(aiResult)}>Set Quantity →</button>
                        <button className="btn-ghost" style={{ width: "100%", marginTop: 8, color: "#f59e0b", borderColor: "rgba(245,158,11,.3)" }}
                          onClick={() => saveToMyFoods(aiResult)}>⭐ Save to My Foods</button>
                        {savedFoodMsg && <div style={{ textAlign: "center", fontSize: 12, color: "#f59e0b", marginTop: 6 }}>{savedFoodMsg}</div>}
                        <button className="btn-ghost" style={{ width: "100%", marginTop: 8 }} onClick={() => { setImagePreview(null); setAiResult(null); setAiError(null); }}>Try another photo</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {tab === "manual" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input className="input" placeholder="Food name *" value={manual.name} onChange={e => setManual(m => ({ ...m, name: e.target.value }))} />
                <input className="input" placeholder="Serving description (e.g. 1 bar, 100g)" value={manual.serving} onChange={e => setManual(m => ({ ...m, serving: e.target.value }))} />
                <div className="grid-2">
                  <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Calories *</label><input className="input" type="number" placeholder="0" value={manual.calories} onChange={e => setManual(m => ({ ...m, calories: e.target.value }))} /></div>
                  <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Protein (g) *</label><input className="input" type="number" placeholder="0" value={manual.protein} onChange={e => setManual(m => ({ ...m, protein: e.target.value }))} /></div>
                  <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Carbs (g)</label><input className="input" type="number" placeholder="0" value={manual.carbs} onChange={e => setManual(m => ({ ...m, carbs: e.target.value }))} /></div>
                  <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Fat (g)</label><input className="input" type="number" placeholder="0" value={manual.fat} onChange={e => setManual(m => ({ ...m, fat: e.target.value }))} /></div>
                  <div><label style={{ fontSize: 11, color: "#f97316", display: "block", marginBottom: 4 }}>Fiber (g) 💊</label><input className="input" type="number" placeholder="0" value={manual.fiber} onChange={e => setManual(m => ({ ...m, fiber: e.target.value }))} style={{ borderColor: manual.fiber ? "#f97316" : undefined }} /></div>
                </div>
                <button className="btn-primary" onClick={submitManual} disabled={!manual.name || !manual.calories}>Add to Log ✓</button>
                <button className="btn-ghost" style={{ color: "#f59e0b", borderColor: "rgba(245,158,11,.3)" }}
                  disabled={!manual.name || !manual.calories}
                  onClick={() => { if (manual.name && manual.calories) saveToMyFoods({ name: manual.name, calories: +manual.calories||0, protein: +manual.protein||0, carbs: +manual.carbs||0, fat: +manual.fat||0, fiber: +manual.fiber||0, serving: manual.serving }); }}>
                  ⭐ Save to My Foods
                </button>
                {savedFoodMsg && <div style={{ textAlign: "center", fontSize: 12, color: "#f59e0b" }}>{savedFoodMsg}</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Google Fit Panel ──────────────────────────────────────────────────────────
function GoogleFitPanel({ profile, onWeightUpdate }) {
  const gfit = useGoogleFit();
  const [weightHistory, setWeightHistory] = useState(() => { try { return JSON.parse(localStorage.getItem("nt_weight_history")) || []; } catch { return []; } });
  const [syncing, setSyncing] = useState(false);
  const [pendingWeight, setPendingWeight] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [newKg, setNewKg] = useState("");
  const [saved, setSaved] = useState(false);

  const saveHistory = entries => { setWeightHistory(entries); localStorage.setItem("nt_weight_history", JSON.stringify(entries)); };

  const recalc = kg => {
    const t = calcProfileTargets(kg, parseFloat(profile.height), parseFloat(profile.age), profile.sex, profile.activity, profile.targetCalorieDeficit, profile.onMounjaro);
    return { ...t, weight: kg };
  };

  const handleSync = async () => {
    setSyncing(true);
    let token = gfit.accessToken;
    if (!gfit.isConnected) token = await gfit.signIn();
    if (!token) { setSyncing(false); return; }
    const entries = await gfit.fetchWeightHistory(token);
    if (entries && entries.length > 0) {
      saveHistory(entries);
      const latest = [...entries].sort((a, b) => b.date.localeCompare(a.date))[0];
      if (Math.abs(latest.kg - parseFloat(profile.weight)) >= 0.5) setPendingWeight(latest);
    }
    setSyncing(false);
  };

  const handleManualSave = () => {
    const kg = parseFloat(newKg);
    if (!kg || kg < 30 || kg > 300) return;
    onWeightUpdate(recalc(kg));
    setSaved(true); setNewKg("");
    setTimeout(() => setSaved(false), 3000);
  };

  const latestWeight = weightHistory.length > 0 ? [...weightHistory].sort((a, b) => b.date.localeCompare(a.date))[0] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Google Fit card */}
      <div className="gfit-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#4285f4" }}>🔵 Google Fit</div>
            {gfit.lastSynced && <div style={{ fontSize: 11, color: C.textMuted }}>Last synced: {gfit.lastSynced}</div>}
          </div>
          {gfit.isConnected
            ? <span className="tag" style={{ background: "rgba(34,197,94,.1)", color: C.green }}>● Connected</span>
            : <span className="tag" style={{ background: "rgba(100,116,139,.1)", color: C.textMuted }}>○ Not connected</span>}
        </div>
        {gfit.isConfigured ? (
          <>
            <button className="btn-google" style={{ width: "100%" }} onClick={handleSync} disabled={syncing}>
              {syncing ? <><span className="spin">⚙</span> Syncing…</> : <><span>🔄</span>{gfit.isConnected ? "Sync Now" : "Connect Google Fit"}</>}
            </button>
            {gfit.isConnected && <button className="btn-ghost" style={{ width: "100%", marginTop: 8, fontSize: 12 }} onClick={gfit.disconnect}>Disconnect</button>}
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10 }}>One-time setup required to enable auto-sync.</div>
            <button className="btn-ghost" style={{ width: "100%", fontSize: 13 }} onClick={() => setShowGuide(s => !s)}>{showGuide ? "Hide" : "Show"} setup guide ↓</button>
            {showGuide && (
              <div style={{ marginTop: 12, background: C.bg, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>
                {[
                  ["1", "Go to", "console.cloud.google.com", "https://console.cloud.google.com"],
                  ["2", "Create a project → enable", '"Fitness API"', null],
                  ["3", "OAuth consent screen → External → add scope", "fitness.body.read", null],
                  ["4", "Credentials → Create → OAuth 2.0 Client ID → Web Application", null, null],
                  ["5", "Add this app's URL as Authorised JavaScript Origin", null, null],
                  ["6", "Paste Client ID at top of app code where it says", "YOUR_GOOGLE_CLIENT_ID_HERE", null],
                ].map(([n, t, h, link]) => (
                  <div key={n} style={{ display: "flex", gap: 8 }}>
                    <span style={{ color: "#4285f4", fontWeight: 700, flexShrink: 0 }}>{n}.</span>
                    <span>{t} {h && (link ? <a href={link} target="_blank" rel="noreferrer" style={{ color: "#4285f4" }}>{h}</a> : <code style={{ background: C.surfaceAlt, padding: "1px 5px", borderRadius: 4, color: C.teal }}>{h}</code>)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pending weight banner */}
      {pendingWeight && (
        <div className="recalc-banner slide-in">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>⚖️ New weight detected</div>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
            Google Fit shows <strong style={{ color: C.teal }}>{pendingWeight.kg} kg</strong> on {pendingWeight.date}. Your profile has {profile.weight} kg. Updating will recalculate all targets.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => { onWeightUpdate(recalc(pendingWeight.kg)); setPendingWeight(null); }}>Update Targets ✓</button>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setPendingWeight(null)}>Keep current</button>
          </div>
        </div>
      )}

      {/* Weight chart */}
      {weightHistory.length > 1 && (
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 13, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8, fontWeight: 600 }}>Weight History</div>
          {latestWeight && <div style={{ marginBottom: 12 }}><span className="mono" style={{ fontSize: 26, fontWeight: 700, color: C.teal }}>{latestWeight.kg}</span><span style={{ fontSize: 13, color: C.textMuted, marginLeft: 4 }}>kg · {latestWeight.date}</span></div>}
          <WeightChart entries={weightHistory} />
          <div style={{ marginTop: 12, maxHeight: 180, overflowY: "auto" }}>
            {[...weightHistory].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map((e, i) => (
              <div key={i} className="weight-row">
                <span style={{ fontSize: 13, color: C.textDim }}>{new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{e.kg} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual weight */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontSize: 13, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600 }}>Manual Weight Update</div>
        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>Current: <strong style={{ color: C.text }}>{profile.weight} kg</strong> · Updating recalculates all targets.</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" type="number" placeholder={`e.g. ${(parseFloat(profile.weight) - 1.5).toFixed(1)}`} value={newKg} onChange={e => setNewKg(e.target.value)} style={{ flex: 1 }} />
          <button className="btn-primary" onClick={handleManualSave} disabled={!newKg}>{saved ? "✓ Saved" : "Update"}</button>
        </div>
      </div>
    </div>
  );
}

// ── AI Health Advisor Chat ────────────────────────────────────────────────────
function AdvisorChat({ profile, todayLog, totals, activeCalories, activeProteinMin, activeProteinMax, activeProtein, todayType }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${profile.name?.split(" ")[0] || "there"}! 👋 I'm your personal health advisor, and I know your full profile and what you've eaten today.\n\nI'm here to help you with:\n- **Is this food good for me?** — just describe it or ask about any meal\n- **What should I eat next?** — I'll suggest based on your remaining targets\n- **Mounjaro questions** — side effects, what to eat, timing\n- **Anything nutrition related** on your weight loss journey\n\nWhat's on your mind?`,
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const buildSystemPrompt = () => {
    const todayFoodSummary = todayLog.length > 0
      ? todayLog.map(m => `- ${m.name} (${m.calories} kcal, ${m.protein}g protein, ${m.fiber || 0}g fiber)`).join("\n")
      : "Nothing logged yet today.";

    return `You are a compassionate, knowledgeable personal health and nutrition advisor for ${profile.name || "the user"}.

## Their Profile
- Weight: ${profile.weight} kg | Height: ${profile.height} cm | Age: ${profile.age} | Sex: ${profile.sex}
- BMI: ${profile.bmi} | IBW: ${profile.ibw} kg | Adjusted BW: ${profile.adjBW} kg
- Activity: ${profile.activity}
- On Mounjaro (Tirzepatide): ${profile.onMounjaro ? `YES — Week ${getMounjaroWeek(profile.mounjaroStartDate) || "?"}` : "No"}

## Today's Targets (${todayType === "gym" ? "🏋️ Gym Day" : todayType === "rest" ? "😴 Rest Day" : "Day type not set"})
- Calories: ${activeCalories} kcal (GI ceiling: ${profile.giCeiling} kcal — don't exceed due to delayed gastric emptying)
- Protein range: ${activeProteinMin}–${activeProteinMax}g
- Fiber: ${profile.fiberTarget || 38}g (critical on Mounjaro to prevent constipation)

## What They've Eaten Today
${todayFoodSummary}

## Today's Running Totals
- Calories: ${Math.round(totals.calories)} / ${activeCalories} kcal (${Math.round(activeCalories - totals.calories)} remaining)
- Protein: ${Math.round(totals.protein)}g (need ${Math.round(Math.max(0, activeProteinMin - totals.protein))}g more to hit minimum)
- Fiber: ${Math.round(totals.fiber * 10) / 10}g / ${profile.fiberTarget || 38}g

## Your Role
- Be warm, encouraging and practical — not clinical or robotic
- When asked about a food, give a clear YES/NO/SOMETIMES answer first, then explain why
- Always factor in their Mounjaro status: GI sensitivity, appetite suppression, constipation risk, muscle preservation
- If they ask what to eat, suggest specific foods that fill their remaining protein/fiber/calorie gaps
- Keep responses concise and mobile-friendly — use bullet points for lists
- You can discuss general health, exercise, sleep, hydration and wellbeing too
- Never recommend stopping or changing their medication — always suggest they consult their doctor for medical decisions
- Use their actual numbers from the profile when giving advice`;
  };

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput("");
    textareaRef.current && (textareaRef.current.style.height = "44px");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const geminiKey = getGeminiKey();
      const claudeKey = getClaudeKey();
      if (!geminiKey && !claudeKey) throw new Error("NO_KEY");
      let reply = "";
      if (geminiKey) {
        const sys = buildSystemPrompt();
        const parts = newMessages.map(m => ({ text: (m.role === "user" ? "User: " : "Assistant: ") + m.content }));
        parts.unshift({ text: "SYSTEM INSTRUCTIONS:\n" + sys + "\n\nConversation:" });
        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts }] }) }
        );
        const gData = await gRes.json();
        reply = gData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't respond.";
      } else {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": claudeKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
          body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1000, system: buildSystemPrompt(), messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
        });
        const data = await res.json();
        reply = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't respond. Please try again.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please check your connection and try again." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const autoResize = e => {
    e.target.style.height = "44px";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const quickQuestions = [
    "Can I eat rice today?",
    "What should I eat next?",
    "Is dates good for me?",
    "Best high-protein snack?",
    "Can I eat this on Mounjaro?",
    "I feel nauseous, what to eat?",
  ];

  // Format AI message with basic markdown
  const formatMessage = (text) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}><span style={{ color: C.teal, flexShrink: 0 }}>•</span><span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>;
      }
      if (line.startsWith("## ")) return <div key={i} style={{ fontWeight: 700, color: C.teal, marginTop: 8, marginBottom: 4 }}>{line.slice(3)}</div>;
      if (line === "") return <div key={i} style={{ height: 6 }} />;
      return <div key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", position: "relative" }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 120 }}>

        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#14b8a6,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 8, marginTop: 2 }}>🤖</div>
            )}
            <div className={m.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
              {m.role === "assistant" ? formatMessage(m.content) : m.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#14b8a6,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
            <div className="chat-bubble-ai" style={{ display: "flex", gap: 5, alignItems: "center", padding: "12px 16px" }}>
              {[0, 1, 2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        )}

        {/* Quick question chips — only show at start */}
        {messages.length === 1 && !loading && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Quick questions:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quickQuestions.map(q => (
                <button key={q} className="quick-chip" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar" style={{ left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480 }}>
        <textarea
          ref={textareaRef}
          className="input"
          placeholder="Ask me anything about food or your health…"
          value={input}
          onChange={e => { setInput(e.target.value); autoResize(e); }}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{ resize: "none", height: 44, overflowY: "auto", lineHeight: "1.4", paddingTop: 11 }}
        />
        <button className="chat-send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
          {loading ? <span className="spin" style={{ fontSize: 16 }}>⚙</span> : "➤"}
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nt_profile"));
      if (!saved) return null;
      // Migrate: old profiles had weekOnMounjaro (manual), new profiles use
      // mounjaroStartDate (auto-calculated). Back-fill a start date estimate.
      if (saved.weekOnMounjaro && !saved.mounjaroStartDate) {
        const weeksAgo = parseInt(saved.weekOnMounjaro) || 1;
        const estimatedStart = new Date(Date.now() - (weeksAgo - 1) * 7 * 86400000);
        saved.mounjaroStartDate = estimatedStart.toISOString().split("T")[0];
        delete saved.weekOnMounjaro;
      }
      // Migrate: recalculate targets if targetCalories looks wrong
      // (e.g. equals TDEE meaning deficit wasn't applied, or missing new fields)
      const fresh = calcProfileTargets(
        parseFloat(saved.weight), parseFloat(saved.height),
        parseFloat(saved.age), saved.sex, saved.activity,
        saved.targetCalorieDeficit, saved.onMounjaro
      );
      const needsMigration = !saved.deficitUsed || saved.targetCalories >= saved.tdee - 100;
      return needsMigration ? { ...saved, ...fresh } : saved;
    } catch { return null; }
  });
  const [logs, setLogs] = useState(() => { try { return JSON.parse(localStorage.getItem("nt_logs")) || {}; } catch { return {}; } });
  const [dayTypes, setDayTypes] = useState(() => { try { return JSON.parse(localStorage.getItem("nt_day_types")) || {}; } catch { return {}; } });
  const [activeTab, setActiveTab] = useState("today");
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showBackupReminder, setShowBackupReminder] = useState(() => {
    const last = localStorage.getItem("nt_last_backup");
    if (!last) return true; // never backed up
    return (Date.now() - parseInt(last)) > 24 * 60 * 60 * 1000;
  });

  // ── Backup helpers ──────────────────────────────────────────────────────────
  const exportBackup = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: JSON.parse(localStorage.getItem("nt_profile") || "null"),
      logs: JSON.parse(localStorage.getItem("nt_logs") || "{}"),
      dayTypes: JSON.parse(localStorage.getItem("nt_day_types") || "{}"),
      weightHistory: JSON.parse(localStorage.getItem("nt_weight_history") || "[]"),
      myFoods: JSON.parse(localStorage.getItem("nt_my_foods") || "[]"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutritrack-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    localStorage.setItem("nt_last_backup", Date.now().toString());
    setShowBackupReminder(false);
  };

  const importBackup = (file) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.version || !data.profile) { alert("Invalid backup file."); return; }
        if (data.profile) localStorage.setItem("nt_profile", JSON.stringify(data.profile));
        if (data.logs) localStorage.setItem("nt_logs", JSON.stringify(data.logs));
        if (data.dayTypes) localStorage.setItem("nt_day_types", JSON.stringify(data.dayTypes));
        if (data.weightHistory) localStorage.setItem("nt_weight_history", JSON.stringify(data.weightHistory));
        if (data.myFoods) localStorage.setItem("nt_my_foods", JSON.stringify(data.myFoods));
        localStorage.setItem("nt_last_backup", Date.now().toString());
        window.location.reload();
      } catch { alert("Could not read backup file. Make sure it's a valid NutriTrack backup."); }
    };
    reader.readAsText(file);
  };

  const todayKey = new Date().toISOString().split("T")[0];
  const todayLog = logs[todayKey] || [];
  const todayType = dayTypes[todayKey] || null;
  const isGymDay = todayType === "gym";

  const activeCalories = isGymDay ? (profile?.gymCalories || profile?.targetCalories || 1800) : (profile?.targetCalories || 1600);
  const activeProtein = isGymDay ? (profile?.gymProtein || 130) : (profile?.restProtein || 120);
  const activeProteinMin = isGymDay ? (profile?.gymProteinMin || 100) : (profile?.restProteinMin || 80);
  const activeProteinMax = isGymDay ? (profile?.gymProteinMax || 150) : (profile?.restProteinMax || 140);

  const totals = todayLog.reduce((acc, m) => ({
    calories: acc.calories + (m.calories || 0),
    protein: acc.protein + (m.protein || 0),
    carbs: acc.carbs + (m.carbs || 0),
    fat: acc.fat + (m.fat || 0),
    fiber: acc.fiber + (m.fiber || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const remCal = Math.max(0, activeCalories - totals.calories);
  const remProtMin = Math.max(0, activeProteinMin - totals.protein);
  const remProtTarget = Math.max(0, activeProtein - totals.protein);
  const overMin = totals.protein >= activeProteinMin;
  const overTarget = totals.protein >= activeProtein;
  const overMax = totals.protein >= activeProteinMax;

  useEffect(() => { if (profile) localStorage.setItem("nt_profile", JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem("nt_logs", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem("nt_day_types", JSON.stringify(dayTypes)); }, [dayTypes]);

  const showNotif = useCallback((msg, type = "info") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const setTodayType = type => setDayTypes(prev => ({ ...prev, [todayKey]: type }));

  const handleWeightUpdate = useCallback(newTargets => {
    setProfile(p => ({ ...p, ...newTargets }));
    showNotif(`⚖️ Weight updated to ${newTargets.weight} kg — targets recalculated!`, "success");
  }, [showNotif]);

  const addMeal = meal => {
    setLogs(prev => ({ ...prev, [todayKey]: [...(prev[todayKey] || []), meal] }));
    const newCal = totals.calories + meal.calories;
    const newProt = totals.protein + meal.protein;
    const rCal = activeCalories - newCal;
    const hitMin = newProt >= activeProteinMin;
    const hitTarget = newProt >= activeProtein;
    const hitMax = newProt >= activeProteinMax;
    let msg = `${meal.name}: ${meal.calories} kcal · ${meal.protein}g protein. `;
    msg += rCal > 0 ? `${Math.round(rCal)} kcal remaining. ` : "Calorie goal reached! ";
    if (hitMax) msg += "Protein maxed out 💪";
    else if (hitTarget) msg += `Above target — up to ${Math.round(activeProteinMax - newProt)}g more if appetite allows.`;
    else if (hitMin) msg += `Minimum hit ✓ — ${Math.round(activeProtein - newProt)}g more to reach target.`;
    else msg += `Need ${Math.round(activeProteinMin - newProt)}g more to hit minimum.`;
    showNotif(msg, hitMin ? "success" : "info");
  };

  const removeEntry = idx => setLogs(prev => ({ ...prev, [todayKey]: (prev[todayKey] || []).filter((_, i) => i !== idx) }));

  if (!profile) return <><style>{css}</style><SetupScreen onComplete={p => setProfile(p)} /></>;

  const historyDays = Object.entries(logs).filter(([k]) => k !== todayKey && (logs[k]?.length || 0) > 0).sort(([a], [b]) => b.localeCompare(a)).slice(0, 14);

  const mealGroups = todayLog.reduce((acc, m, i) => {
    const k = m.mealType || "Other";
    if (!acc[k]) acc[k] = [];
    acc[k].push({ ...m, _idx: i });
    return acc;
  }, {});

  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{css}</style>

      {/* Daily backup reminder */}
      {showBackupReminder && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 201, background: "#1e293b", borderBottom: "1px solid rgba(20,184,166,.3)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>
            <span style={{ color: C.amber }}>💾</span> <strong style={{ color: C.text }}>Daily backup due</strong> — save your data before switching devices
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={exportBackup} style={{ background: C.teal, color: "#000", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Back Up</button>
            <button onClick={() => setShowBackupReminder(false)} style={{ background: "transparent", color: C.textMuted, border: "none", padding: "6px 8px", cursor: "pointer", fontSize: 16, fontFamily: "Inter,sans-serif" }}>×</button>
          </div>
        </div>
      )}

      {notification && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: notification.type === "success" ? C.green : C.teal, color: "#000", padding: "12px 16px", fontSize: 13, fontWeight: 500, animation: "slideIn .3s ease" }}>
          {notification.msg}
        </div>
      )}

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingTop: (notification || showBackupReminder) ? 48 : 0, transition: "padding .3s" }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 700 }}>{greeting}, {profile.name?.split(" ")[0] || "there"} 👋</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              {profile.onMounjaro && <span style={{ color: C.purple, marginLeft: 8 }}>· Week {getMounjaroWeek(profile.mounjaroStartDate)} 💉</span>}
            </div>
          </div>
          <button className="btn-ghost" style={{ fontSize: 11, padding: "6px 10px", borderColor: (!getClaudeKey() && !getGeminiKey()) ? "rgba(245,158,11,.5)" : undefined, color: (!getClaudeKey() && !getGeminiKey()) ? C.amber : undefined }}
            onClick={() => setProfile(null)}>
            {(!getClaudeKey() && !getGeminiKey()) ? "🔑 Add API Key" : "⚙ Settings"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: C.surface, padding: 4, borderRadius: 12, border: `1px solid ${C.border}` }}>
          {[["today", "Today"], ["history", "History"], ["weight", "⚖️"], ["insights", "Insights"], ["advisor", "🤖 Advisor"]].map(([id, label]) => (
            <button key={id} className={`tab ${activeTab === id ? "tab-active" : "tab-inactive"}`} style={{ fontSize: 11 }} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </div>

        {/* ── TODAY ── */}
        {activeTab === "today" && (
          <div>
            {/* Day type selector */}
            {!todayType ? (
              <div className="day-type-card">
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>How's today looking? 💬</div>
                <div style={{ fontSize: 13, color: C.textDim, marginBottom: 16 }}>Your protein and calorie targets adjust based on your answer.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="day-btn day-btn-gym" onClick={() => setTodayType("gym")}>
                    <span style={{ fontSize: 28 }}>🏋️</span>
                    <span>Gym Day</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: C.textDim }}>{profile.gymCalories} kcal</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: C.amber }}>{profile.gymProteinMin}–{profile.gymProteinMax}g protein</span>
                  </button>
                  <button className="day-btn day-btn-rest" onClick={() => setTodayType("rest")}>
                    <span style={{ fontSize: 28 }}>😴</span>
                    <span>Rest Day</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: C.textDim }}>{profile.targetCalories} kcal</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: C.purple }}>{profile.restProteinMin}–{profile.restProteinMax}g protein</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span className={isGymDay ? "day-badge-gym" : "day-badge-rest"}>
                  {isGymDay ? "🏋️ Gym Day" : "😴 Rest Day"}
                  <span style={{ fontWeight: 400, opacity: .8 }}>· {activeCalories} kcal · {activeProteinMin}–{activeProteinMax}g protein</span>
                </span>
                <button className="btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setTodayType(null)}>Change</button>
              </div>
            )}

            {/* Ring + macros (only after day type set) */}
            {todayType && (
              <>
                <div className="card" style={{ padding: 24, marginBottom: 16, display: "flex", alignItems: "center", gap: 24 }}>
                  <Ring value={totals.calories} max={activeCalories} size={110} stroke={10}>
                    <div>
                      <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: C.teal }}>{Math.round(totals.calories)}</div>
                      <div style={{ fontSize: 9, color: C.textMuted }}>of {activeCalories}</div>
                      <div style={{ fontSize: 9, color: C.textMuted }}>kcal</div>
                    </div>
                  </Ring>
                  <div style={{ flex: 1 }}>
                    {/* Protein — range bar */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: C.textDim }}>Protein</span>
                        <span className="mono" style={{ fontSize: 12, color: overMax ? C.green : overTarget ? C.teal : overMin ? C.amber : C.red }}>
                          {Math.round(totals.protein)}g
                          <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "Inter,sans-serif" }}> / {activeProteinMin}–{activeProteinMax}g</span>
                        </span>
                      </div>
                      {/* Range bar: shows min zone, target zone, max zone */}
                      <div style={{ position: "relative", height: 6, borderRadius: 3, background: C.border, overflow: "visible" }}>
                        {/* Green zone between min and max */}
                        <div style={{ position: "absolute", left: `${(activeProteinMin / activeProteinMax) * 100}%`, right: 0, top: 0, bottom: 0, background: "rgba(20,184,166,.15)", borderRadius: 3 }} />
                        {/* Min marker */}
                        <div style={{ position: "absolute", left: `${(activeProteinMin / activeProteinMax) * 100}%`, top: -2, width: 2, height: 10, background: C.amber, borderRadius: 1 }} />
                        {/* Target marker */}
                        <div style={{ position: "absolute", left: `${(activeProtein / activeProteinMax) * 100}%`, top: -2, width: 2, height: 10, background: C.teal, borderRadius: 1 }} />
                        {/* Fill */}
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min((totals.protein / activeProteinMax) * 100, 100)}%`, background: overMax ? C.green : overTarget ? C.teal : overMin ? C.amber : C.red, borderRadius: 3, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                        <span style={{ fontSize: 9, color: C.textMuted }}>0</span>
                        <span style={{ fontSize: 9, color: C.amber }}>min {activeProteinMin}g</span>
                        <span style={{ fontSize: 9, color: C.teal }}>target {activeProtein}g</span>
                        <span style={{ fontSize: 9, color: C.textMuted }}>max {activeProteinMax}g</span>
                      </div>
                    </div>
                    {/* Carbs, Fat & Fiber */}
                    {[["Carbs", totals.carbs, 150, C.green], ["Fat", totals.fat, 60, C.red]].map(([label, val, max, color]) => (
                      <div key={label} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: C.textDim }}>{label}</span>
                          <span className="mono" style={{ fontSize: 12, color }}>{Math.round(val)}g</span>
                        </div>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min((val / max) * 100, 100)}%`, background: color }} /></div>
                      </div>
                    ))}
                    {/* Fiber — special importance on Mounjaro */}
                    {(() => {
                      const fiberTarget = profile.fiberTarget || 38;
                      const fiberPct = totals.fiber / fiberTarget;
                      const fiberColor = fiberPct >= 1 ? C.green : fiberPct >= 0.5 ? "#f97316" : C.red;
                      return (
                        <div style={{ marginBottom: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: C.textDim }}>
                              Fiber
                              {profile.onMounjaro && <span style={{ fontSize: 10, color: C.purple, marginLeft: 4 }}>💉 key for Mounjaro</span>}
                            </span>
                            <span className="mono" style={{ fontSize: 12, color: fiberColor }}>
                              {Math.round(totals.fiber * 10) / 10}g
                              <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "Inter,sans-serif" }}> / {fiberTarget}g</span>
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(fiberPct * 100, 100)}%`, background: fiberColor, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
                          </div>
                          {fiberPct < 0.5 && totals.calories > 300 && (
                            <div style={{ fontSize: 10, color: "#f97316", marginTop: 3 }}>
                              Need {Math.round(fiberTarget - totals.fiber)}g more — try veg, oats or lentils
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Remaining */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  <div className="card-alt" style={{ padding: 14, textAlign: "center" }}>
                    <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: remCal === 0 ? C.green : C.teal }}>{remCal}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>kcal remaining</div>
                    {remCal === 0 && <div style={{ fontSize: 10, color: C.green, marginTop: 2 }}>Goal reached! 🎉</div>}
                  </div>
                  <div className="card-alt" style={{ padding: 14, textAlign: "center" }}>
                    {overMax ? (
                      <>
                        <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: C.green }}>{Math.round(totals.protein)}g</div>
                        <div style={{ fontSize: 11, color: C.green }}>Protein maxed! 💪</div>
                      </>
                    ) : overTarget ? (
                      <>
                        <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: C.teal }}>{Math.round(activeProteinMax - totals.protein)}g</div>
                        <div style={{ fontSize: 11, color: C.teal }}>above target</div>
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>+{Math.round(activeProteinMax - totals.protein)}g if appetite allows</div>
                      </>
                    ) : overMin ? (
                      <>
                        <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: C.amber }}>{Math.round(remProtTarget)}g</div>
                        <div style={{ fontSize: 11, color: C.amber }}>min hit ✓ · to target</div>
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Eat more if you can</div>
                      </>
                    ) : (
                      <>
                        <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: C.red }}>{Math.round(remProtMin)}g</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>to hit minimum</div>
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Floor: {activeProteinMin}g</div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Mounjaro reminder */}
            {todayType && profile.onMounjaro && !overMin && totals.calories > 0 && (
              <div className="mounjaro-badge" style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: C.textDim }}>
                  💉 <strong style={{ color: C.purple }}>Mounjaro reminder:</strong> You need <strong>{Math.round(remProtMin)}g more protein</strong> to hit your minimum of {activeProteinMin}g. Even a small protein shake helps — try to reach {activeProtein}g if appetite allows.
                </div>
              </div>
            )}

            {/* Gym day tip */}
            {isGymDay && totals.calories === 0 && (
              <div style={{ background: "rgba(20,184,166,.08)", border: "1px solid rgba(20,184,166,.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: C.textDim }}>
                🏋️ <strong style={{ color: C.teal }}>Gym day!</strong> You have {profile.gymCalories} kcal and {profile.gymProtein}g protein today. Fuel up with a solid pre- or post-workout meal.
              </div>
            )}

            {/* Meal log */}
            {todayLog.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.textMuted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: C.textDim, marginBottom: 6 }}>Nothing logged yet</div>
                <div style={{ fontSize: 13 }}>{todayType ? "Tap + to log your first meal" : "Set your day type above first"}</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Object.entries(mealGroups).map(([mealType, items]) => (
                  <div key={mealType}>
                    <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8, fontWeight: 600 }}>{mealType}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {items.map((m, i) => (
                        <div key={i} className="meal-row slide-in">
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{m.serving} · {m.time}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div className="mono" style={{ fontSize: 14, color: C.teal }}>{m.calories} kcal</div>
                            <div style={{ fontSize: 11, color: C.amber }}>{m.protein}g protein</div>
                            {(m.fiber || 0) > 0 && <div style={{ fontSize: 11, color: "#f97316" }}>{m.fiber}g fiber</div>}
                          </div>
                          <button className="btn-danger" onClick={() => removeEntry(m._idx)}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY ── */}
        {activeTab === "history" && (
          <div>
            {historyDays.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.textMuted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                <div style={{ fontSize: 14 }}>No history yet. Keep logging daily!</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {historyDays.map(([date, entries]) => {
                  const dt = dayTypes[date];
                  const protTarget = dt === "gym" ? profile.gymProtein : profile.restProtein;
                  const calTarget = dt === "gym" ? profile.gymCalories : profile.targetCalories;
                  const dayT = entries.reduce((a, m) => ({ calories: a.calories + m.calories, protein: a.protein + m.protein, fiber: a.fiber + (m.fiber || 0) }), { calories: 0, protein: 0, fiber: 0 });
                  const calMet = dayT.calories >= calTarget * 0.85;
                  const protMet = dayT.protein >= protTarget * 0.9;
                  const d = new Date(date + "T12:00:00");
                  return (
                    <div key={date} className="card" style={{ padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                            <span style={{ fontSize: 11, color: C.textMuted }}>{entries.length} meals</span>
                            {dt && <span className={dt === "gym" ? "day-badge-gym" : "day-badge-rest"} style={{ fontSize: 10, padding: "2px 7px" }}>{dt === "gym" ? "🏋️ Gym" : "😴 Rest"}</span>}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <span className="tag" style={{ background: calMet ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)", color: calMet ? C.green : C.red }}>{Math.round(dayT.calories)} kcal</span>
                          <span className="tag" style={{ background: protMet ? "rgba(245,158,11,.1)" : "rgba(239,68,68,.1)", color: protMet ? C.amber : C.red }}>{Math.round(dayT.protein)}g</span>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>Calories (of {calTarget})</div>
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min((dayT.calories / calTarget) * 100, 100)}%`, background: calMet ? C.green : C.teal }} /></div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>Protein (of {protTarget}g)</div>
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min((dayT.protein / protTarget) * 100, 100)}%`, background: protMet ? C.green : C.amber }} /></div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>Fiber ({Math.round(dayT.fiber)}g / {profile.fiberTarget || 38}g)</div>
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min((dayT.fiber / (profile.fiberTarget || 38)) * 100, 100)}%`, background: dayT.fiber >= (profile.fiberTarget || 38) ? C.green : "#f97316" }} /></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── WEIGHT ── */}
        {activeTab === "weight" && <GoogleFitPanel profile={profile} onWeightUpdate={handleWeightUpdate} />}

        {/* ── INSIGHTS ── */}
        {activeTab === "insights" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14, fontWeight: 600 }}>Targets by Day Type</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "rgba(20,184,166,.07)", border: "1px solid rgba(20,184,166,.2)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.teal, marginBottom: 10 }}>🏋️ Gym Day</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ textAlign: "center" }}><div className="mono" style={{ fontSize: 16, fontWeight: 700, color: C.teal }}>{profile.gymCalories}</div><div style={{ fontSize: 10, color: C.textMuted }}>kcal</div><div style={{ fontSize: 10, color: C.textDim }}>Calories</div></div>
                    <div style={{ textAlign: "center" }}>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: C.amber }}>{profile.gymProteinMin}–{profile.gymProteinMax}g</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>min → max</div>
                      <div style={{ fontSize: 10, color: C.textDim }}>Protein range</div>
                    </div>
                  </div>
                </div>
                <div style={{ background: "rgba(167,139,250,.07)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.purple, marginBottom: 10 }}>😴 Rest Day</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ textAlign: "center" }}><div className="mono" style={{ fontSize: 16, fontWeight: 700, color: C.purple }}>{profile.targetCalories}</div><div style={{ fontSize: 10, color: C.textMuted }}>kcal</div><div style={{ fontSize: 10, color: C.textDim }}>Calories</div></div>
                    <div style={{ textAlign: "center" }}>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: C.purple }}>{profile.restProteinMin}–{profile.restProteinMax}g</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>min → max</div>
                      <div style={{ fontSize: 10, color: C.textDim }}>Protein range</div>
                    </div>
                  </div>
                </div>
                {profile.adjBW && profile.adjBW < profile.weight && (
                  <div style={{ background: C.bg, borderRadius: 10, padding: 12, fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>
                    <div style={{ fontWeight: 600, color: C.textDim, marginBottom: 4 }}>💡 Why these protein targets?</div>
                    Per the 2025 OMA/TOS/ASN/ACLM Joint Advisory: <strong style={{ color: C.text }}>an absolute protein target of 80–120g/day</strong> is recommended for GLP-1 users to enhance adherence while protecting muscle. At high BMI, using actual weight inflates protein to unrealistic levels — we calculate on adjusted body weight ({profile.adjBW} kg) and clamp to the OMA absolute range. Exceeding ~120–130g also increases constipation risk due to slowed gut motility on Mounjaro.
                    <div style={{ marginTop: 6, color: C.textMuted }}>IBW: {profile.ibw} kg · Adjusted BW: {profile.adjBW} kg · Actual: {profile.weight} kg</div>
                  </div>
                )}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 12, lineHeight: 1.6 }}>Targets switch automatically each day based on your morning selection. Gym calories include +175 kcal to fuel your workout.</div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14, fontWeight: 600 }}>Metabolic Stats</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[
                  ["TDEE", profile.tdee, "kcal/day"],
                  ["BMR", profile.bmr, "kcal/day"],
                  ["BMI", profile.bmi, "kg/m²"],
                  ["Deficit", `−${profile.deficitUsed}`, "kcal/day"],
                ].map(([l, v, u]) => (
                  <div key={l} className="macro-chip">
                    <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: C.textDim }}>{v}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{u}</div>
                    <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: C.bg, borderRadius: 10, padding: 12, fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>
                <div style={{ fontWeight: 600, color: C.textDim, marginBottom: 6 }}>📐 How your calorie target is calculated</div>
                <div>TDEE ({profile.tdee} kcal) − {profile.deficitUsed} kcal deficit = {Math.round(profile.tdee - profile.deficitUsed)} kcal → capped at GI ceiling → <strong style={{ color: C.teal }}>{profile.targetCalories} kcal/day</strong></div>
                <div style={{ marginTop: 6, fontSize: 11, color: C.textMuted }}>
                  Two constraints apply on Mounjaro: (1) a BMI-scaled calorie deficit to drive weight loss, and (2) a <strong>GI ceiling of {profile.giCeiling} kcal</strong> — the AGA clinical practice update flags that intake above this level causes nausea, vomiting and reflux due to delayed gastric emptying on GLP-1s. Your target is the lower of the two. Floor is 85% of BMR ({profile.bmr} kcal).
                </div>
              </div>
            </div>

            {historyDays.length > 0 && (() => {
              const last7 = historyDays.slice(0, 7);
              const avgCal = Math.round(last7.reduce((s, [, e]) => s + e.reduce((a, m) => a + m.calories, 0), 0) / last7.length);
              const avgProt = Math.round(last7.reduce((s, [, e]) => s + e.reduce((a, m) => a + m.protein, 0), 0) / last7.length);
              const gymCount = last7.filter(([d]) => dayTypes[d] === "gym").length;
              const restCount = last7.filter(([d]) => dayTypes[d] === "rest").length;
              return (
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 13, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14, fontWeight: 600 }}>Last 7 Days</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                    <div className="macro-chip"><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: avgCal > profile.gymCalories ? C.red : C.teal }}>{avgCal}</div><div style={{ fontSize: 10, color: C.textMuted }}>kcal/day avg</div></div>
                    <div className="macro-chip"><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: avgProt < profile.restProtein ? C.red : C.green }}>{avgProt}<span style={{ fontSize: 11 }}>g</span></div><div style={{ fontSize: 10, color: C.textMuted }}>protein/day avg</div></div>
                  </div>
                  {(gymCount > 0 || restCount > 0) && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className="tag" style={{ background: "rgba(20,184,166,.1)", color: C.teal }}>🏋️ {gymCount} gym day{gymCount !== 1 ? "s" : ""}</span>
                      <span className="tag" style={{ background: "rgba(167,139,250,.1)", color: C.purple }}>😴 {restCount} rest day{restCount !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {profile.onMounjaro && (
              <div className="mounjaro-badge">
                <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, marginBottom: 8 }}>💉 Mounjaro Journey — Week {getMounjaroWeek(profile.mounjaroStartDate)}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>
                  <div>• Gym days: <strong style={{ color: C.teal }}>{profile.gymProtein}g protein</strong> at 1.5g/kg adjusted BW — supports muscle repair</div>
                  <div>• Rest days: <strong style={{ color: C.purple }}>{profile.restProtein}g protein</strong> at 1.2g/kg adjusted BW — realistic on suppressed appetite</div>
                  <div>• Spread across <strong style={{ color: C.text }}>3–4 meals</strong> of 20–30g each — easier to absorb than one big serving</div>
                  <div>• Best sources: protein shakes, eggs, Greek yogurt, chicken, tuna, cottage cheese</div>
                  <div>• Even if not hungry, eat protein first — it protects muscle during rapid loss</div>
                  <div>• 🟠 <strong style={{ color: "#f97316" }}>Fiber goal: {profile.fiberTarget || 38}g/day</strong> — critical on Mounjaro to counter constipation from slowed gut motility. Aim for oats, lentils, vegetables and psyllium husk.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ADVISOR ── */}
        {activeTab === "advisor" && (
          <AdvisorChat
            profile={profile}
            todayLog={todayLog}
            totals={totals}
            activeCalories={activeCalories}
            activeProteinMin={activeProteinMin}
            activeProteinMax={activeProteinMax}
            activeProtein={activeProtein}
            todayType={todayType}
          />
        )}

      </div>

      {/* Floating add button — hidden on advisor tab */}
      {activeTab !== "advisor" && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
          <button className="btn-primary pulse" style={{ borderRadius: "50%", width: 64, height: 64, fontSize: 28, boxShadow: "0 8px 32px rgba(20,184,166,.4)" }} onClick={() => setShowModal(true)}>+</button>
        </div>
      )}

      {showModal && <AddFoodModal onAdd={addMeal} onClose={() => setShowModal(false)} />}
    </>
  );
}
