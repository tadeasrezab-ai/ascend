/* ===================================================================
   ASCEND — strength + fuel
   Vanilla JS, localStorage, no build step.
   =================================================================== */

const IMG = id => `https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/${id}`;

/* ---------- exercise library (real photo source) ---------- */
const EX = {
  incline:  {id:'Incline_Push-Up', name:'Incline Push-Up', tag:'push',
             cue:'Hands on a counter or wall. Body in one straight line, lower with control. The higher the surface, the easier.'},
  pushup:   {id:'Pushups', name:'Push-Up', tag:'push',
             cue:'Elbows ~45° from your body, chest to fist height, full lockout. Squeeze glutes so hips don’t sag.'},
  decline:  {id:'Decline_Push-Up', name:'Decline Push-Up', tag:'push',
             cue:'Feet elevated to load more of your bodyweight onto the chest and shoulders. A step beyond the standard push-up.'},
  closepush:{id:'Push-Ups_-_Close_Triceps_Position', name:'Close-Grip Push-Up', tag:'push',
             cue:'Hands narrow, elbows tucked tight. Builds the triceps lockout that finishes a push-up.'},
  benchdip: {id:'Bench_Dips', name:'Bench Dip', tag:'push',
             cue:'Hands on a chair behind you, lower until elbows hit 90°, press back up. Triceps and front-shoulder strength.'},
  scap:     {id:'Scapular_Pull-Up', name:'Dead Hang + Scapular Pull', tag:'pull',
             cue:'Hang from the bar, then shrug your shoulders down and back without bending the elbows. Builds grip and the first inch of a pull-up.'},
  band:     {id:'Band_Assisted_Pull-Up', name:'Band-Assisted Pull-Up', tag:'pull',
             cue:'Loop a resistance band over the bar, foot in the loop. Pull until your chin clears the bar, lower slowly.'},
  chin:     {id:'Chin-Up', name:'Chin-Up', tag:'pull',
             cue:'Palms facing you. Easier than a pull-up because the biceps help. Usually your first full rep comes here.'},
  pullup:   {id:'Pullups', name:'Pull-Up', tag:'pull',
             cue:'Palms away. Start from a dead hang, lead with the chest, chin over the bar, no kipping.'},
  row:      {id:'Inverted_Row', name:'Inverted Row', tag:'pull',
             cue:'Under a sturdy bar or table, body straight, pull your chest to the edge. The horizontal partner to the pull-up.'},
  squat:    {id:'Bodyweight_Squat', name:'Bodyweight Squat', tag:'legs',
             cue:'Feet shoulder-width, sit back and down to at least parallel, chest up, drive through the heels.'},
  lunge:    {id:'Bodyweight_Walking_Lunge', name:'Walking Lunge', tag:'legs',
             cue:'Long step, back knee toward the floor, push through the front heel. Great single-leg strength and balance.'},
  bridge:   {id:'Butt_Lift_Bridge', name:'Glute Bridge', tag:'legs',
             cue:'On your back, drive hips up, squeeze glutes hard at the top. Protects the lower back your kicks rely on.'},
  plank:    {id:'Plank', name:'Plank', tag:'core',
             cue:'Forearms down, body rigid from heels to head. Brace the abs like you’re about to take a body shot.'},
  sideplank:{id:'Side_Bridge', name:'Side Plank', tag:'core',
             cue:'On one forearm, stack the hips, hold a straight line. Builds the obliques that rotate your punches and kicks.'},
  deadbug:  {id:'Dead_Bug', name:'Dead Bug', tag:'core',
             cue:'On your back, lower opposite arm and leg slowly while keeping the lower back flat to the floor.'},
  superman: {id:'Superman', name:'Superman', tag:'core',
             cue:'Face down, lift arms and legs, squeeze the lower back and glutes. Balances all the pressing work.'},
  climber:  {id:'Mountain_Climbers', name:'Mountain Climbers', tag:'core',
             cue:'Plank position, drive knees to chest fast. Core plus a conditioning hit.'},
  hipraise: {id:'Bent-Knee_Hip_Raise', name:'Bent-Knee Hip Raise', tag:'core',
             cue:'On your back, curl the knees up toward your chest, lifting the hips off the floor. Lower abs.'},
};

/* ---------- progression engine (weeks 1-10, then continuous) ---------- */
function phaseOf(week){
  if(week<=2) return 1;
  if(week<=4) return 2;
  if(week<=6) return 3;
  if(week<=8) return 4;
  if(week<=10) return 5;
  return 6;
}
const PHASE_META = {
  1:{name:'Foundation', weeks:'Weeks 1-2', goal:'Teach the positions. Build grip, a straight-line body, and the first inch of a pull. No failure reps yet.', ex:['incline','scap']},
  2:{name:'Build',      weeks:'Weeks 3-4', goal:'More volume on harder inclines and longer hangs. Add horizontal rows to grow the back.', ex:['incline','row']},
  3:{name:'Strength',   weeks:'Weeks 5-6', goal:'Slow negative push-ups from the floor and band-assisted pull-ups. This is where real strength shows up.', ex:['pushup','band']},
  4:{name:'Bridge',     weeks:'Weeks 7-8', goal:'First full push-ups in low-rep sets, and unassisted negative pull-ups. The gap to a full rep closes fast here.', ex:['pushup','pullup']},
  5:{name:'Peak',       weeks:'Weeks 9-10',goal:'Push-up volume climbs and your first full chin-up / pull-up arrives. Test a true max on the last session.', ex:['chin','pullup']},
  6:{name:'Strength phase', weeks:'Week 11 onward', goal:'The plan keeps progressing: more reps, then harder variations (decline push-ups, strict pull-ups). Stronger every week.', ex:['decline','pullup']},
};

// push prescription by week
function pushPrescription(week){
  const p = phaseOf(week);
  switch(p){
    case 1: return {key:'incline', scheme:'4 sets × 6-8 reps', note:'Hands on a kitchen counter. Stop 2 reps before failure.'};
    case 2: return {key:'incline', scheme:'4 sets × 8-12 reps', note:'Lower the surface to a chair so it’s harder than weeks 1-2.'};
    case 3: return {key:'pushup', scheme:'4 sets × 5 slow negatives', note:'From the top, lower to the floor over 4 seconds. Reset on your knees, repeat.'};
    case 4: return {key:'pushup', scheme:'5 sets × 3-5 full reps', note:'Full range. If you stall, drop to an incline for the last set.'};
    case 5: return {key:'pushup', scheme:'5 sets × (max minus 1) reps', note:'Leave one rep in the tank each set. Test a true max on the final session of week 10.'};
    default:{
      const extra = week - 10;
      const reps = 8 + extra;            // grows each week
      return {key: extra>4 ? 'decline':'pushup',
              scheme:`5 sets × ${reps} reps`,
              note: extra>4 ? 'Feet elevated now to keep it challenging as you get stronger.'
                            : 'Add a rep per set each week. When 5×15 feels easy, switch to decline push-ups.'};
    }
  }
}
// pull prescription by week
function pullPrescription(week){
  const p = phaseOf(week);
  switch(p){
    case 1: return {key:'scap', scheme:'4 × 20-30s hang, then 3 × 8 scap pulls', note:'Just hang and shrug. Builds grip and shoulder control safely.'};
    case 2: return {key:'scap', scheme:'4 × 40s hang, then 3 × 10 scap pulls', note:'Longer hangs. Pair with the inverted rows below.'};
    case 3: return {key:'band', scheme:'4 sets × 5 reps', note:'Band over the bar, foot in the loop. Chin clears the bar every rep.'};
    case 4: return {key:'pullup', scheme:'4 sets × 3 negatives (5s lower)', note:'Jump or step to the top, then lower as slowly as you can. This is the big one.'};
    case 5: return {key:'chin', scheme:'5 × 3 negatives, then attempt 1 full rep', note:'Chin-ups (palms toward you) come before pull-ups. Test on the final session of week 10.'};
    default:{
      const extra = week - 10;
      const reps = 2 + Math.ceil(extra/2);
      return {key: extra>5 ? 'pullup':'chin',
              scheme:`5 sets × ${reps} reps`,
              note: extra>5 ? 'Strict pull-ups now. Dead hang each rep, no swinging.'
                            : 'Add a rep every couple of weeks. Once you hit 5×5 chin-ups, move to strict pull-ups.'};
    }
  }
}

/* ---------- weekly schedule ---------- */
// 0 Sun .. 6 Sat
const SCHEDULE = {
  1:'kickbox', 3:'kickbox', 4:'kickbox', 5:'kickbox',
  2:'strengthA', 6:'strengthB', 0:'recovery'
};

const SNACK = "3 short sets spread through the day: easy push-ups (stop 2 reps short of failure) and one 15-second dead hang. Greasing the groove teaches the movement daily without burning you out for kickbox.";

function sessionFor(dayType, week){
  if(dayType==='kickbox'){
    return {
      type:'kickbox', tag:'Kickbox', title:'Kickbox session',
      focus:'Your main conditioning today. Train hard, then refuel. Under-eating on kickbox days is what stalls strength.',
      blocks:[
        {plain:true, text:'Warm up: 5 min rope or shadow boxing, hips and shoulders loose.'},
        {check:true, text:'Kickbox class / training', scheme:'Your main session today'},
        {check:true, text:'Skill snack', scheme:'2-3 sets easy push-ups + a short dead hang'},
        {plain:true, text:'Cool down + 5 min light stretching.'},
      ]
    };
  }
  if(dayType==='recovery'){
    return {
      type:'recovery', tag:'Recovery', title:'Active recovery & mobility',
      focus:'Move blood, not mountains. Light work that helps you grow and keeps the joints happy.',
      blocks:[
        {key:'bridge', scheme:'2 sets × 12', note:'Wake the glutes up.'},
        {key:'deadbug', scheme:'2 sets × 8 each side', note:'Gentle core control.'},
        {key:'scap', scheme:'3 × 20s easy hang', note:'Decompress the spine, keep grip used to the bar.'},
        {check:true, text:'Easy walk + full-body stretch', scheme:'10-20 min'},
      ]
    };
  }
  const push = pushPrescription(week);
  const pull = pullPrescription(week);
  if(dayType==='strengthA'){
    return {
      type:'strength', tag:'Strength · Push + Core', title:'Push & core day',
      focus:'The push-up engine. Press strength plus the core that keeps your body rigid in a push-up and a kick.',
      blocks:[
        {plain:true, text:'Warm up: arm circles, 10 band pull-aparts or scap pulls, 10 easy squats.'},
        {key:push.key, scheme:push.scheme, note:push.note},
        {key:'benchdip', scheme:'3 sets × 8-10', note:'Triceps lockout strength.'},
        {key:'plank', scheme:'3 × 30-45s', note:'Brace hard, no sagging hips.'},
        {key:'deadbug', scheme:'3 × 8 each side', note:'Anti-arch core control.'},
        {key:'climber', scheme:'3 × 30s', note:'Finisher: core plus a little conditioning.'},
      ]
    };
  }
  // strengthB
  return {
    type:'strength', tag:'Strength · Pull + Lower', title:'Pull & lower day',
    focus:'The pull-up engine plus legs your kicks will thank you for. The most important day of your week for the bar.',
    blocks:[
      {plain:true, text:'Warm up: 30s dead hang, 10 scap pulls, 10 squats.'},
      {key:pull.key, scheme:pull.scheme, note:pull.note},
      {key:'row', scheme:'4 sets × 8-12', note:'Horizontal pulling builds the back that makes pull-ups possible.'},
      {key:'squat', scheme:'3 sets × 15', note:'Strong legs, better balance for kicks.'},
      {key:'lunge', scheme:'3 × 10 each leg', note:'Single-leg strength.'},
      {key:'superman', scheme:'3 × 12', note:'Balance all the pressing with lower-back work.'},
    ]
  };
}

/* ---------- storage ---------- */
const KEY={profile:'ascend.profile', meals:'ascend.meals', ticks:'ascend.ticks', stats:'ascend.stats', journal:'ascend.journal'};
const load=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??f}catch{return f}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

function todayKey(d=new Date()){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
const parseKey=dk=>new Date(dk+'T00:00:00');

/* ---------- nutrition math ---------- */
function targets(p){
  if(!p||!p.weight||!p.height||!p.age) return null;
  const w=+p.weight, h=+p.height, a=+p.age;
  const bmr = p.sex==='f' ? (10*w+6.25*h-5*a-161) : (10*w+6.25*h-5*a+5);
  const tdee = bmr * (+p.activity||1.725);
  let factor = 0.90;                 // recomp: slight cut
  if(p.goal==='maintain') factor=1.0;
  if(p.goal==='cut') factor=0.82;
  const calories = Math.round(tdee*factor/10)*10;
  const protein = Math.round(1.8*w);            // g/kg
  const fat = Math.round(0.9*w);                // g/kg
  let carbs = Math.round((calories - protein*4 - fat*9)/4);
  if(carbs<0) carbs=0;
  return {bmr:Math.round(bmr), tdee:Math.round(tdee), calories, protein, carbs, fat};
}
/* split remaining calories into carbs/fat when a source only gives kcal+protein */
function deriveMacros(kcal,pro){
  const proCal=(pro||0)*4, rem=Math.max(0,(kcal||0)-proCal);
  const fatCal=Math.min(rem, (kcal||0)*0.30);
  return {fat:Math.round(fatCal/9), carb:Math.max(0,Math.round((rem-fatCal)/4))};
}
const macroSplit=m=>{
  const p=(m.pro||0)*4, c=(m.carb||0)*4, f=(m.fat||0)*9, tot=p+c+f||1;
  return {p:Math.round(p/tot*100), c:Math.round(c/tot*100), f:Math.round(f/tot*100)};
};

/* ---------- time / week ---------- */
function daysSince(){
  if(!profile||!profile.start) return 0;
  return Math.floor((parseKey(todayKey())-parseKey(profile.start))/86400000);
}
function weekNumber(){ return Math.max(1, Math.floor(daysSince()/7)+1); }
function weekForKey(dk){
  if(!profile||!profile.start) return 1;
  const d=Math.floor((parseKey(dk)-parseKey(profile.start))/86400000);
  return Math.max(1, Math.floor(d/7)+1);
}
function sessionForKey(dk){
  const dow=parseKey(dk).getDay();
  return sessionFor(SCHEDULE[dow], weekForKey(dk));
}
function countableIdx(sess){
  return sess.blocks.map((b,i)=>(b.check||b.key)?i:-1).filter(i=>i>=0);
}

/* ---------- quick foods ---------- */
// [name, kcal, protein, carbs, fat]
const QUICK=[
  ['Chicken breast (150g)',248,46,0,6],['2 eggs',156,13,1,11],['Greek yogurt (170g)',100,17,6,0],
  ['Whey shake (1 scoop)',120,24,3,2],['Oats (60g dry)',228,9,40,4],['Rice (1 cup cooked)',205,4,45,0],
  ['Salmon (150g)',280,39,0,13],['Tuna can, drained',130,29,0,1],['Cottage cheese (200g)',196,22,8,8],
  ['Lean beef mince (150g)',248,32,0,13],['Lentils (1 cup)',230,18,40,1],['Banana',105,1,27,0],
  ['Apple',95,1,25,0],['Almonds (30g)',174,6,6,15],['Avocado (half)',160,2,9,15],
  ['Bread slice',80,3,14,1],['Peanut butter (1 tbsp)',94,4,3,8],['Olive oil (1 tbsp)',119,0,0,14],
];

/* ===================================================================
   CALORIE ESTIMATOR  — reads a description, sums known foods
   gram foods: k/p are per 100g, serv = default grams when no qty given
   unit foods: k/p are per item/serving
   Ordered specific-first so multi-word names match before generic ones.
   =================================================================== */
const FOODS=[
  {s:['chicken breast','chicken'],u:'g',k:165,p:31,serv:150},
  {s:['chicken thigh'],u:'g',k:209,p:26,serv:150},
  {s:['turkey'],u:'g',k:135,p:29,serv:150},
  {s:['ground beef','beef mince','mince'],u:'g',k:250,p:26,serv:150},
  {s:['steak','beef'],u:'g',k:271,p:25,serv:150},
  {s:['pork'],u:'g',k:242,p:27,serv:150},
  {s:['bacon'],u:'g',k:541,p:37,serv:30},
  {s:['salmon'],u:'g',k:208,p:20,serv:150},
  {s:['tuna'],u:'g',k:116,p:26,serv:120},
  {s:['cod','white fish','fish'],u:'g',k:82,p:18,serv:150},
  {s:['shrimp','prawns','prawn'],u:'g',k:99,p:24,serv:120},
  {s:['protein shake','whey','protein powder','protein scoop'],u:'each',k:120,p:24},
  {s:['protein bar'],u:'each',k:200,p:20},
  {s:['greek yogurt'],u:'g',k:59,p:10,serv:170},
  {s:['yogurt','yoghurt'],u:'g',k:63,p:4,serv:170},
  {s:['cottage cheese'],u:'g',k:98,p:11,serv:200},
  {s:['cheese'],u:'g',k:402,p:25,serv:30},
  {s:['milk'],u:'g',k:50,p:3.4,serv:250},
  {s:['egg whites','egg white'],u:'g',k:52,p:11,serv:100},
  {s:['eggs','egg'],u:'each',k:78,p:6},
  {s:['oats','oatmeal','porridge'],u:'g',k:389,p:17,serv:50},
  {s:['rice'],u:'g',k:130,p:2.7,serv:180},
  {s:['pasta','spaghetti','noodles'],u:'g',k:158,p:6,serv:200},
  {s:['quinoa'],u:'g',k:120,p:4.4,serv:150},
  {s:['sweet potato'],u:'g',k:86,p:1.6,serv:150},
  {s:['potato','potatoes'],u:'g',k:87,p:2,serv:150},
  {s:['bread','toast'],u:'each',k:80,p:3},
  {s:['tortilla','wrap'],u:'each',k:150,p:4},
  {s:['bagel'],u:'each',k:250,p:10},
  {s:['lentils','lentil'],u:'g',k:116,p:9,serv:200},
  {s:['chickpeas','chickpea'],u:'g',k:164,p:9,serv:150},
  {s:['black beans','kidney beans','beans'],u:'g',k:127,p:8.7,serv:150},
  {s:['tofu'],u:'g',k:76,p:8,serv:150},
  {s:['hummus'],u:'g',k:166,p:8,serv:50},
  {s:['broccoli'],u:'g',k:34,p:2.8,serv:120},
  {s:['spinach'],u:'g',k:23,p:2.9,serv:80},
  {s:['salad','greens','lettuce'],u:'g',k:50,p:2,serv:120},
  {s:['mixed veg','vegetables','veggies','veg'],u:'g',k:40,p:2.5,serv:150},
  {s:['tomato','tomatoes'],u:'g',k:18,p:0.9,serv:100},
  {s:['avocado'],u:'each',k:240,p:3},
  {s:['banana'],u:'each',k:105,p:1.3},
  {s:['apple'],u:'each',k:95,p:0.5},
  {s:['orange'],u:'each',k:62,p:1.2},
  {s:['berries','strawberries','blueberries'],u:'g',k:50,p:1,serv:100},
  {s:['almonds','walnuts','cashews','nuts'],u:'g',k:579,p:21,serv:30},
  {s:['peanut butter'],u:'each',k:94,p:4},
  {s:['olive oil','butter','oil'],u:'each',k:110,p:0},
  {s:['chocolate'],u:'g',k:535,p:8,serv:30},
  {s:['pizza'],u:'each',k:285,p:12},
  {s:['burger'],u:'each',k:350,p:17},
  {s:['fries','chips'],u:'g',k:312,p:3.4,serv:120},
  {s:['beer'],u:'each',k:150,p:1.5},
];
function estimate(desc){
  let t=' '+(desc||'').toLowerCase().replace(/[^a-z0-9.\/\s]/g,' ').replace(/\s+/g,' ')+' ';
  let kcal=0,pro=0; const matched=[];
  for(const f of FOODS){
    for(const kw of f.s){
      const pos=t.indexOf(kw);
      if(pos<0) continue;
      const pre=t.slice(Math.max(0,pos-12),pos);
      const m=pre.match(/(\d+(?:\.\d+)?)\s*([a-z]*)\s*$/);
      let grams=null,count=null;
      if(m){
        const n=parseFloat(m[1]); const u=m[2];
        if(['g','gram','grams','gr'].includes(u)) grams=n;
        else if(u==='kg') grams=n*1000;
        else if(u==='oz') grams=n*28;
        else if(u==='ml') grams=n;
        else if(u==='l') grams=n*1000;
        else count=n;
      }
      if(f.u==='g'){
        const g = grams!=null ? grams : (count!=null ? count*(f.serv||100) : (f.serv||100));
        kcal += f.k*g/100; pro += f.p*g/100;
      } else {
        const c = count!=null ? count : 1;
        kcal += f.k*c; pro += f.p*c;
      }
      matched.push(f.s[0]);
      t = t.slice(0,pos)+' '.repeat(kw.length)+t.slice(pos+kw.length);
      break;
    }
  }
  const dm=deriveMacros(Math.round(kcal),Math.round(pro));
  return {kcal:Math.round(kcal), pro:Math.round(pro), carb:dm.carb, fat:dm.fat, matched};
}

/* ===================================================================
   RECIPES
   =================================================================== */
const RECIPES=[
  {id:'r1',name:'Chicken & rice power bowl',kcal:620,pro:52,mins:25,tags:['high-protein','meal-prep'],
   ing:['180g chicken breast','1 cup cooked rice','1 cup broccoli','1/2 avocado','1 tbsp olive oil','Lemon, garlic, paprika'],
   steps:['Season chicken with paprika, garlic and salt.','Pan-fry in olive oil 6-7 min per side until cooked through, rest, then slice.','Steam or microwave the broccoli.','Build the bowl: rice, chicken, broccoli, sliced avocado, squeeze of lemon.']},
  {id:'r2',name:'Greek yogurt protein oats',kcal:410,pro:32,mins:10,tags:['breakfast','quick'],
   ing:['50g oats','170g Greek yogurt','1 scoop whey','1 banana','Handful berries','Cinnamon'],
   steps:['Cook oats with water or milk for 3-4 min.','Stir whey into the warm (not boiling) oats.','Top with Greek yogurt, sliced banana and berries.','Finish with cinnamon.']},
  {id:'r3',name:'Salmon, sweet potato & greens',kcal:540,pro:42,mins:30,tags:['high-protein','dinner'],
   ing:['150g salmon fillet','200g sweet potato','2 cups spinach','1 tbsp olive oil','Garlic, chilli flakes'],
   steps:['Roast cubed sweet potato at 200C / 400F for 25 min.','Pan-sear salmon skin-down 4 min, flip 2-3 min.','Wilt spinach with garlic in the same pan.','Plate together, drizzle with olive oil.']},
  {id:'r4',name:'Beef & veg stir-fry',kcal:560,pro:45,mins:20,tags:['high-protein','quick'],
   ing:['150g lean beef strips','1 cup mixed veg','150g cooked rice or noodles','1 tbsp soy sauce','Ginger, garlic, sesame oil'],
   steps:['Sear beef hot and fast, 2 min, set aside.','Stir-fry veg with ginger and garlic 3-4 min.','Return beef, add soy sauce, toss 1 min.','Serve over rice or noodles.']},
  {id:'r5',name:'Tuna avocado wrap',kcal:480,pro:38,mins:10,tags:['quick','lunch'],
   ing:['1 can tuna, drained','1/2 avocado','1 large tortilla','Greek yogurt (1 tbsp)','Lettuce, red onion, lemon'],
   steps:['Mash tuna with avocado, yogurt and lemon.','Season with salt and pepper.','Spread over the tortilla, add lettuce and onion.','Roll tight and slice in half.']},
  {id:'r6',name:'Egg & spinach scramble on toast',kcal:380,pro:27,mins:12,tags:['breakfast','quick'],
   ing:['3 eggs','2 cups spinach','2 slices wholegrain bread','10g cheese','1 tsp butter'],
   steps:['Whisk eggs with a pinch of salt.','Wilt spinach in butter, pour in eggs.','Stir gently over low heat to soft scramble, fold in cheese.','Serve on toast.']},
  {id:'r7',name:'Lentil & chickpea curry',kcal:520,pro:24,mins:35,tags:['veggie','meal-prep'],
   ing:['200g cooked lentils','150g chickpeas','1 can chopped tomatoes','150g cooked rice','Onion, garlic, curry spices','1 tsp oil'],
   steps:['Soften onion and garlic in oil.','Add curry spices, toast 30 sec.','Add tomatoes, lentils and chickpeas, simmer 20 min.','Serve over rice.']},
  {id:'r8',name:'Cottage cheese & berry bowl',kcal:300,pro:28,mins:5,tags:['breakfast','quick','snack'],
   ing:['200g cottage cheese','100g berries','15g almonds','1 tsp honey'],
   steps:['Spoon cottage cheese into a bowl.','Top with berries and chopped almonds.','Drizzle with a little honey.']},
  {id:'r9',name:'Turkey meatballs & pasta',kcal:640,pro:48,mins:30,tags:['high-protein','dinner'],
   ing:['180g turkey mince','200g cooked pasta','1 can chopped tomatoes','1 egg','Garlic, basil, parmesan'],
   steps:['Mix turkey with egg, garlic and salt, roll into balls.','Brown the meatballs in a pan.','Add tomatoes and basil, simmer 12 min.','Toss with pasta, top with parmesan.']},
  {id:'r10',name:'Tofu veggie poke bowl',kcal:500,pro:26,mins:20,tags:['veggie','lunch'],
   ing:['150g firm tofu','150g cooked rice','1/2 avocado','1 cup mixed veg','Soy sauce, sesame, lime'],
   steps:['Press and cube tofu, pan-fry until golden.','Glaze with soy sauce and sesame.','Build bowl with rice, tofu, avocado and veg.','Finish with lime and sesame seeds.']},
  {id:'r11',name:'Protein banana pancakes',kcal:450,pro:35,mins:15,tags:['breakfast'],
   ing:['1 banana','2 eggs','1 scoop whey','40g oats','Berries to top'],
   steps:['Blend banana, eggs, whey and oats into a batter.','Cook small pancakes 1-2 min per side.','Stack and top with berries.']},
  {id:'r12',name:'Shrimp & quinoa salad',kcal:470,pro:36,mins:20,tags:['high-protein','lunch'],
   ing:['150g shrimp','150g cooked quinoa','2 cups salad greens','1/2 avocado','1 tbsp olive oil, lemon'],
   steps:['Sear shrimp 2 min per side with garlic.','Toss quinoa, greens and avocado.','Top with shrimp, dress with olive oil and lemon.']},
  {id:'r13',name:'Overnight protein chia pudding',kcal:360,pro:25,mins:5,tags:['breakfast','meal-prep'],
   ing:['3 tbsp chia seeds','250ml milk','1 scoop whey','Berries, cinnamon'],
   steps:['Whisk chia, milk and whey until no clumps.','Refrigerate overnight (or 3+ hours).','Top with berries and cinnamon before eating.']},
  {id:'r14',name:'Chicken fajita bowl',kcal:580,pro:50,mins:25,tags:['high-protein','dinner'],
   ing:['180g chicken breast','1 cup peppers & onion','150g cooked rice','150g black beans','Fajita spices, lime'],
   steps:['Toss sliced chicken in fajita spices.','Sear with peppers and onion 8-10 min.','Warm the beans.','Serve over rice with beans and a squeeze of lime.']},
  {id:'r15',name:'Steak, potato & broccoli',kcal:600,pro:46,mins:30,tags:['high-protein','dinner'],
   ing:['170g lean steak','200g potato','1 cup broccoli','1 tsp olive oil','Garlic, pepper'],
   steps:['Roast cubed potato 25 min at 200C / 400F.','Sear steak 3 min per side, rest 5 min, slice.','Steam broccoli.','Plate with a little olive oil and cracked pepper.']},
  {id:'r16',name:'Smashed chickpea & egg sandwich',kcal:440,pro:26,mins:10,tags:['veggie','quick','lunch'],
   ing:['150g chickpeas','2 eggs (boiled)','2 slices bread','1 tbsp Greek yogurt','Lemon, herbs'],
   steps:['Smash chickpeas with boiled eggs and yogurt.','Add lemon, salt and herbs.','Pile onto bread and close the sandwich.']},
  {id:'r17',name:'Chicken Caesar (lighter)',kcal:490,pro:44,mins:15,tags:['high-protein','lunch'],
   ing:['180g chicken breast','2 cups romaine','15g parmesan','2 tbsp Greek-yogurt Caesar','Croutons, black pepper'],
   steps:['Grill and slice the chicken.','Whisk Greek yogurt with lemon, garlic and a little parmesan for a lighter Caesar.','Toss romaine, chicken and dressing.','Top with parmesan and croutons.']},
  {id:'r18',name:'Beef burrito bowl',kcal:610,pro:46,mins:20,tags:['high-protein','dinner','meal-prep'],
   ing:['150g lean beef mince','150g cooked rice','150g black beans','1/2 avocado','Salsa, lime, coriander'],
   steps:['Brown the beef with cumin and paprika.','Warm the beans.','Bowl up rice, beef, beans and avocado.','Finish with salsa, lime and coriander.']},
  {id:'r19',name:'Baked cod & potatoes',kcal:470,pro:40,mins:30,tags:['high-protein','dinner'],
   ing:['180g cod','200g potatoes','1 cup green beans','1 tbsp olive oil','Lemon, garlic, parsley'],
   steps:['Roast sliced potatoes 20 min at 200C / 400F.','Add cod and green beans, drizzle oil and lemon.','Bake another 10-12 min until cod flakes.','Scatter with parsley.']},
  {id:'r20',name:'Teriyaki salmon bowl',kcal:580,pro:40,mins:20,tags:['high-protein','dinner'],
   ing:['150g salmon','150g cooked rice','1 cup broccoli','1 tbsp teriyaki/soy','Sesame, spring onion'],
   steps:['Glaze salmon with teriyaki and roast 12 min.','Steam the broccoli.','Serve over rice.','Top with sesame and spring onion.']},
  {id:'r21',name:'Veggie omelette',kcal:340,pro:26,mins:12,tags:['breakfast','quick','veggie'],
   ing:['3 eggs','1/2 cup peppers & onion','1 cup spinach','15g cheese','1 tsp oil'],
   steps:['Soften peppers and onion in oil.','Add spinach until wilted.','Pour in whisked eggs, cook until just set.','Fold with cheese inside.']},
  {id:'r22',name:'Peanut chicken noodles',kcal:640,pro:45,mins:20,tags:['high-protein','dinner'],
   ing:['170g chicken breast','150g cooked noodles','1 cup mixed veg','1.5 tbsp peanut butter','Soy, lime, garlic'],
   steps:['Whisk peanut butter, soy, lime and a splash of water into a sauce.','Sear chicken, add veg, stir-fry 4 min.','Toss in noodles and the sauce.','Heat through 1 min.']},
  {id:'r23',name:'Turkey chili',kcal:520,pro:44,mins:35,tags:['high-protein','meal-prep'],
   ing:['180g turkey mince','150g kidney beans','1 can chopped tomatoes','Onion, garlic','Chili & cumin'],
   steps:['Brown turkey with onion and garlic.','Add spices, tomatoes and beans.','Simmer 25 min until thick.','Great over rice or on its own.']},
  {id:'r24',name:'Tuna pasta salad',kcal:520,pro:38,mins:15,tags:['high-protein','quick','lunch'],
   ing:['1 can tuna','150g cooked pasta','1 cup sweetcorn & peppers','1 tbsp Greek yogurt','Lemon, herbs'],
   steps:['Mix tuna with yogurt and lemon.','Fold through cooled pasta and veg.','Season and chill or eat right away.']},
  {id:'r25',name:'Chicken egg-fried rice',kcal:600,pro:42,mins:20,tags:['high-protein','quick'],
   ing:['150g chicken breast','150g cooked rice','2 eggs','1 cup peas & carrots','Soy, sesame, garlic'],
   steps:['Sear diced chicken, set aside.','Scramble eggs in the pan.','Add rice and veg, fry hot.','Return chicken, add soy and sesame.']},
  {id:'r26',name:'Greek chicken pita',kcal:560,pro:46,mins:20,tags:['high-protein','lunch'],
   ing:['180g chicken breast','1 wholemeal pita','3 tbsp tzatziki','Tomato, cucumber, red onion','Oregano, lemon'],
   steps:['Marinate chicken in lemon and oregano, then grill and slice.','Warm the pita.','Fill with chicken, salad and tzatziki.']},
  {id:'r27',name:'Shakshuka',kcal:400,pro:24,mins:25,tags:['breakfast','veggie'],
   ing:['3 eggs','1 can chopped tomatoes','1/2 onion & pepper','Garlic, paprika, cumin','Bread to dip'],
   steps:['Soften onion, pepper and garlic.','Add tomatoes and spices, simmer 8 min.','Make wells and crack in the eggs.','Cover and cook until whites set. Serve with bread.']},
  {id:'r28',name:'Green protein smoothie',kcal:330,pro:30,mins:5,tags:['breakfast','quick','snack'],
   ing:['1 scoop whey','1 banana','1 cup spinach','250ml milk','1 tbsp peanut butter'],
   steps:['Add everything to a blender.','Blend until smooth.','Add ice or water to loosen if needed.']},
  {id:'r29',name:'Black bean quesadilla',kcal:520,pro:26,mins:15,tags:['veggie','quick'],
   ing:['1 large tortilla','150g black beans','40g cheese','1/2 cup peppers','Salsa'],
   steps:['Mash beans with cumin.','Spread over half the tortilla with cheese and peppers.','Fold and toast both sides until crisp.','Slice and serve with salsa.']},
  {id:'r30',name:'Chicken & sweet potato traybake',kcal:560,pro:48,mins:35,tags:['high-protein','meal-prep'],
   ing:['200g chicken breast','200g sweet potato','1 cup peppers & onion','1 tbsp olive oil','Paprika, garlic'],
   steps:['Toss everything with oil and spices on a tray.','Roast 28-32 min at 200C / 400F, turning once.','Rest the chicken 5 min, then serve.']},
  {id:'r31',name:'Salmon poke bowl',kcal:540,pro:38,mins:15,tags:['high-protein','lunch'],
   ing:['150g sashimi-grade salmon','150g cooked rice','1/2 avocado','Cucumber, edamame','Soy, sesame, lime'],
   steps:['Cube the salmon and toss in soy and sesame.','Bowl up rice, salmon and veg.','Top with avocado, lime and sesame.']},
  {id:'r32',name:'Beef & broccoli',kcal:520,pro:44,mins:20,tags:['high-protein','quick'],
   ing:['170g lean beef strips','2 cups broccoli','150g cooked rice','Soy, ginger, garlic','1 tsp cornflour'],
   steps:['Sear beef hot, 2 min, remove.','Stir-fry broccoli with ginger and garlic.','Add soy plus cornflour slurry to thicken.','Return beef, toss, serve on rice.']},
  {id:'r33',name:'Hearty lentil soup',kcal:380,pro:22,mins:35,tags:['veggie','meal-prep'],
   ing:['200g cooked lentils','Carrot, celery, onion','1 can chopped tomatoes','Stock, garlic, cumin','Bread to serve'],
   steps:['Soften the veg with garlic.','Add lentils, tomatoes, stock and cumin.','Simmer 20 min.','Blend a little for body, season and serve.']},
  {id:'r34',name:'Cottage cheese pancakes',kcal:420,pro:34,mins:15,tags:['breakfast'],
   ing:['150g cottage cheese','2 eggs','40g oats','1 tsp baking powder','Berries to top'],
   steps:['Blend cottage cheese, eggs, oats and baking powder.','Cook small pancakes 1-2 min per side.','Stack and top with berries.']},
  {id:'r35',name:'Tofu scramble',kcal:360,pro:26,mins:15,tags:['veggie','breakfast'],
   ing:['200g firm tofu','1 cup spinach','1/2 cup peppers','Turmeric, garlic','2 slices toast'],
   steps:['Crumble tofu into a hot pan with a little oil.','Add turmeric, garlic, peppers and spinach.','Cook 5 min until golden.','Serve on toast.']},
  {id:'r36',name:'Garlic prawn stir-fry',kcal:450,pro:40,mins:18,tags:['high-protein','quick'],
   ing:['180g prawns','2 cups mixed veg','150g cooked noodles','Garlic, ginger, soy','Chili, lime'],
   steps:['Stir-fry garlic and ginger 30 sec.','Add prawns, cook 2-3 min.','Add veg and noodles, toss with soy.','Finish with chili and lime.']},
  {id:'r37',name:'Chicken pesto pasta',kcal:650,pro:48,mins:20,tags:['high-protein','dinner'],
   ing:['180g chicken breast','200g cooked pasta','2 tbsp pesto','Cherry tomatoes','Parmesan, rocket'],
   steps:['Grill and slice the chicken.','Toss pasta with pesto and a splash of pasta water.','Fold in chicken and tomatoes.','Top with parmesan and rocket.']},
  {id:'r38',name:'Steak fajitas',kcal:580,pro:46,mins:25,tags:['high-protein','dinner'],
   ing:['170g lean steak','1 cup peppers & onion','2 tortillas','Fajita spice','Lime, yogurt'],
   steps:['Sear spiced steak 3 min per side, rest and slice.','Char peppers and onion in the same pan.','Fill tortillas with steak and veg.','Add a squeeze of lime and a spoon of yogurt.']},
  {id:'r39',name:'Peanut butter overnight oats',kcal:430,pro:28,mins:5,tags:['breakfast','meal-prep'],
   ing:['50g oats','1 scoop whey','1 tbsp peanut butter','250ml milk','Banana to top'],
   steps:['Stir oats, whey, peanut butter and milk together.','Refrigerate overnight.','Top with sliced banana before eating.']},
  {id:'r40',name:'Greek salad with chicken',kcal:480,pro:42,mins:15,tags:['high-protein','lunch','quick'],
   ing:['180g chicken breast','Cucumber, tomato, red onion','40g feta','Olives','Olive oil, oregano'],
   steps:['Grill and slice the chicken.','Chop the salad and toss with olive oil and oregano.','Top with chicken, feta and olives.']},
  {id:'r41',name:'Miso-glazed tofu bowl',kcal:500,pro:27,mins:25,tags:['veggie','dinner'],
   ing:['200g firm tofu','150g cooked rice','1 cup edamame & greens','1 tbsp miso','Sesame, spring onion'],
   steps:['Press and cube tofu, roast 20 min.','Brush with miso glaze for the last 5 min.','Bowl up rice, tofu and greens.','Finish with sesame and spring onion.']},
  {id:'r42',name:'Egg & avocado toast',kcal:420,pro:22,mins:10,tags:['breakfast','quick'],
   ing:['2 eggs','1/2 avocado','2 slices wholegrain bread','Chili flakes, lemon','Salt, pepper'],
   steps:['Poach or fry the eggs.','Mash avocado with lemon, salt and chili.','Spread on toast and top with the eggs.']},
];
let recipeFilter='all';

/* ===================================================================
   RENDER
   =================================================================== */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const shortDays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const prefersReduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
const escapeHTML=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

let profile = load(KEY.profile,null);

/* motion image: animates through the real start -> end frames */
function motionImg(id){
  return `<div class="motion">
    <img class="mf mf0" loading="lazy" src="${IMG(id)}/0.jpg" alt="" onerror="this.closest('.motion').classList.add('noimg')">
    <img class="mf mf1" loading="lazy" src="${IMG(id)}/1.jpg" alt="" onerror="this.remove()">
    <span class="motion-tag">in motion</span>
  </div>`;
}

function blockHTML(b,i,checked){
  if(b.plain) return `<li class="block-plain"><span class="dot">▸</span><span>${b.text}</span></li>`;
  if(b.check) return `<li class="block-item check ${checked?'ticked':''}">
      <button class="tick" data-i="${i}" aria-pressed="${checked}" aria-label="Mark done">✓</button>
      <div class="block-body"><div class="block-name">${b.text}</div>${b.scheme?`<div class="block-scheme">${b.scheme}</div>`:''}</div></li>`;
  const e=EX[b.key];
  return `<li class="block-item ex ${checked?'ticked':''}">
      <button class="tick" data-i="${i}" aria-pressed="${checked}" aria-label="Mark done">✓</button>
      ${motionImg(e.id)}
      <div class="block-body"><div class="block-name">${e.name}</div><div class="block-scheme">${b.scheme||''}</div><div class="block-cue">${b.note||e.cue}</div></div></li>`;
}

function getTicks(dk){ return load(KEY.ticks,{})[dk]||[]; }
function toggleTick(dk,i){
  const all=load(KEY.ticks,{}); const arr=new Set(all[dk]||[]);
  arr.has(i)?arr.delete(i):arr.add(i);
  all[dk]=[...arr]; save(KEY.ticks,all);
}

function renderToday(){
  const now=new Date();
  const tk=todayKey();
  const week=weekNumber();
  const dayType=SCHEDULE[now.getDay()];
  const sess=sessionFor(dayType, week);
  const ph=PHASE_META[phaseOf(week)];

  $('#today-date').textContent = `${dayNames[now.getDay()]} · Week ${week} · ${ph.name}`;
  const name = profile&&profile.name ? `, ${profile.name.split(' ')[0]}` : '';
  const greet = dayType==='kickbox' ? `Kickbox day${name}.`
             : dayType==='recovery' ? `Recover well${name}.`
             : `Time to build${name}.`;
  $('#today-greet').textContent = greet;
  $('#today-phase').textContent = ph.goal;

  $('#today-type-tag').textContent = sess.tag;
  $('#today-session-title').textContent = sess.title;
  $('#today-session-focus').textContent = sess.focus;

  const ticks=getTicks(tk);
  const idxs=countableIdx(sess);
  let done=0; idxs.forEach(i=>{if(ticks.includes(i))done++;});
  $('#today-blocks').innerHTML = sess.blocks.map((b,i)=>blockHTML(b,i,ticks.includes(i))).join('');
  $$('#today-blocks .tick').forEach(btn=>btn.onclick=()=>{toggleTick(tk,+btn.dataset.i);renderToday();});

  const foot=$('#workout-foot');
  const pct = idxs.length? Math.round(done/idxs.length*100):0;
  const complete = idxs.length>0 && done===idxs.length;
  foot.innerHTML = `
    <div class="prog"><div class="prog-fill" style="width:${pct}%"></div></div>
    <div class="prog-label">${complete?'✓ Workout complete. Nice work.':`${done} of ${idxs.length} ticked off`}</div>`;
  foot.classList.toggle('complete',complete);

  $('#snack-text').textContent = SNACK;
  renderCheckin(complete);
  renderRecapBanner();
  renderRings();
}

/* ---------- daily check-in (sleep / mood / trained) ---------- */
const MOODS=['Rough','Low','Okay','Good','Great'];
let moodPick=null, trainedPick=null;
function renderCheckin(autoTrained){
  if(!$('#checkin-card')) return;
  const dk=todayKey();
  const j=load(KEY.journal,{})[dk]||{};
  moodPick = j.mood ?? null;
  trainedPick = (j.trained!==undefined && j.trained!==null) ? j.trained : !!autoTrained;
  $('#j-sleep').value = j.sleep ?? '';
  $('#j-note').value = j.note ?? '';
  $('#mood-row').innerHTML = MOODS.map((m,i)=>`<button type="button" class="mood-btn ${moodPick===i+1?'active':''}" data-mood="${i+1}">${m}</button>`).join('');
  $('#trained-row').innerHTML =
    `<button type="button" class="pick-btn ${trainedPick===true?'active':''}" data-trained="1">Yes</button>
     <button type="button" class="pick-btn ${trainedPick===false?'active':''}" data-trained="0">No</button>`;
  $$('#mood-row .mood-btn').forEach(b=>b.onclick=()=>{moodPick=+b.dataset.mood;$$('#mood-row .mood-btn').forEach(x=>x.classList.toggle('active',x===b));});
  $$('#trained-row .pick-btn').forEach(b=>b.onclick=()=>{trainedPick=b.dataset.trained==='1';$$('#trained-row .pick-btn').forEach(x=>x.classList.toggle('active',x===b));});
  $('#j-hint').textContent = j.saved ? 'Logged today. Update anytime.' : '';
}
function saveCheckin(){
  const dk=todayKey(); const all=load(KEY.journal,{});
  const sleep=parseFloat($('#j-sleep').value);
  all[dk]={sleep:isNaN(sleep)?null:sleep, mood:moodPick, trained:trainedPick, note:$('#j-note').value.trim(), saved:true};
  save(KEY.journal,all);
  $('#j-hint').textContent='Logged today. Update anytime.';
  flash($('#j-save'),'✓ Saved');
}

function renderRecapBanner(){
  const el=$('#recap-banner'); if(!el) return;
  const w=weekNumber(); const inWeek=((daysSince()%7)+7)%7;
  if(w<2 || inWeek!==0){ el.innerHTML=''; return; }
  const r=recap(w-1);
  el.innerHTML=`<article class="card recap-card reveal in">
    <span class="tag accent">Week ${r.week} recap</span>
    <div class="recap-stats">
      <div class="recap-stat"><div class="rv">${r.sessionsDone}/${r.totalSessions}</div><div class="rl">sessions done</div></div>
      <div class="recap-stat"><div class="rv">${r.avgCal??'—'}</div><div class="rl">avg kcal/day</div></div>
      <div class="recap-stat"><div class="rv">${r.proHit}</div><div class="rl">protein days hit</div></div>
      <div class="recap-stat"><div class="rv">${r.avgSleep==null?'—':r.avgSleep+'h'}</div><div class="rl">avg sleep</div></div>
      <div class="recap-stat"><div class="rv">${r.wDelta==null?'—':(r.wDelta>0?'+':'')+r.wDelta+'kg'}</div><div class="rl">weight change</div></div>
    </div>
    <p class="card-note">${recapWord(r)}</p>
  </article>`;
}
function recapWord(r){
  if(r.sessionsDone>=6) return 'Outstanding adherence. This is exactly how the push-up and pull-up come.';
  if(r.sessionsDone>=4) return 'Solid week. Tick a couple more sessions next week and the progress compounds.';
  return 'Quiet week. No guilt: just aim to tick off one more session than last time.';
}

function renderRings(){
  const t=targets(profile);
  const meals=load(KEY.meals,{})[todayKey()]||[];
  const eatenCal=meals.reduce((s,m)=>s+(+m.kcal||0),0);
  const eatenPro=meals.reduce((s,m)=>s+(+m.pro||0),0);
  const eatenCarb=meals.reduce((s,m)=>s+(+m.carb||0),0);
  const eatenFat=meals.reduce((s,m)=>s+(+m.fat||0),0);
  const calTarget=t?t.calories:2200, proTarget=t?t.protein:140;
  countUp($('#cal-left'), Math.max(0,calTarget-eatenCal));
  countUp($('#pro-left'), Math.max(0,proTarget-eatenPro));
  setRing($('#ring-cal'), Math.min(1,eatenCal/calTarget));
  setRing($('#ring-pro'), Math.min(1,eatenPro/proTarget));
  const mini=$('#macro-mini');
  if(mini) mini.innerHTML = t ? `
    <div class="mm"><span class="mm-v">${Math.max(0,t.protein-eatenPro)}g</span><span class="mm-l">protein left</span></div>
    <div class="mm"><span class="mm-v">${Math.max(0,t.carbs-eatenCarb)}g</span><span class="mm-l">carbs left</span></div>
    <div class="mm"><span class="mm-v">${Math.max(0,t.fat-eatenFat)}g</span><span class="mm-l">fat left</span></div>` : '';
  if(!t){ $('#fuel-summary').textContent='Add your stats in “You” to get calorie & macro targets.'; return; }
  $('#fuel-summary').innerHTML = eatenCal>calTarget
    ? `You’re <b>${eatenCal-calTarget}</b> kcal over today. Protein: ${eatenPro} / ${proTarget}g.`
    : `Eaten <b>${eatenCal}</b> of ${calTarget} kcal · <b>${eatenPro}</b> of ${proTarget}g protein.`;
}
function setRing(c,frac){
  const r=52, circ=2*Math.PI*r;
  c.style.strokeDasharray=circ; c.style.strokeDashoffset=circ;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ c.style.strokeDashoffset=circ*(1-frac); }));
}
function countUp(el,to){
  if(!el) return;
  if(prefersReduced()){el.textContent=to;return;}
  const from=+String(el.textContent).replace(/\D/g,'')||0;
  const dur=700,t0=performance.now();
  const step=t=>{const k=Math.min(1,(t-t0)/dur);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);};
  requestAnimationFrame(step);
}

/* ---------- plan ---------- */
function renderPlan(){
  const week=weekNumber(); const todayDow=new Date().getDay();
  const order=[1,2,3,4,5,6,0];
  $('#week-grid').innerHTML=order.map(dow=>{
    const type=SCHEDULE[dow]; const sess=sessionFor(type,week);
    const cls=type==='kickbox'?'kick':type.startsWith('strength')?'strength':'';
    const label=type==='kickbox'?'Kickbox':type==='strengthA'?'Push + core':type==='strengthB'?'Pull + lower':'Recovery';
    const desc=type==='kickbox'?'Conditioning + skill snack':type==='recovery'?'Mobility & light core':sess.focus.split('.')[0];
    return `<div class="day-cell ${cls} ${dow===todayDow?'today-flag':''}">
      <div class="day-name">${shortDays[dow]}</div><div class="day-type">${label}</div><div class="day-desc">${desc}</div></div>`;
  }).join('');
  const cur=phaseOf(week);
  $('#timeline').innerHTML=[1,2,3,4,5,6].map(p=>{
    const m=PHASE_META[p];
    const imgs=m.ex.map(k=>`<img loading="lazy" src="${IMG(EX[k].id)}/0.jpg" alt="${EX[k].name}" onerror="this.style.visibility='hidden'">`).join('');
    return `<div class="phase-card ${p===6?'peak':''} reveal" style="${p===cur?'border-color:var(--accent)':''}">
      <div class="phase-imgs">${imgs}</div>
      <div><div class="phase-weeks">${m.weeks}${p===cur?' · you are here':''}</div>
      <div class="phase-name">${m.name}</div><div class="phase-goal">${m.goal}</div></div></div>`;
  }).join('');
  observeReveals();
}

/* ---------- moves ---------- */
let moveFilter='all';
function renderMoves(){
  const tags=[['all','All'],['push','Push'],['pull','Pull'],['legs','Legs'],['core','Core']];
  $('#moves-filter').innerHTML=tags.map(([k,l])=>`<button class="chip ${k===moveFilter?'active':''}" data-tag="${k}">${l}</button>`).join('');
  const items=Object.values(EX).filter(e=>moveFilter==='all'||e.tag===moveFilter);
  $('#moves-grid').innerHTML=items.map(e=>`
    <div class="move-card">
      <div class="move-img">${motionImg(e.id)}</div>
      <div class="move-meta"><div class="move-name">${e.name}</div><span class="move-tag">${e.tag}</span><div class="move-cue">${e.cue}</div></div>
    </div>`).join('');
  $$('#moves-filter .chip').forEach(c=>c.onclick=()=>{moveFilter=c.dataset.tag;renderMoves();});
}

/* ---------- fuel ---------- */
let fuelTab='log';
function renderFuel(){
  const t=targets(profile);
  $('#fuel-target-line').textContent=t
    ? `Daily target: ${t.calories} kcal · ${t.protein}g protein · ${t.carbs}g carbs · ${t.fat}g fat. A slight cut that keeps your strength climbing.`
    : 'Add your stats in “You” to unlock daily targets.';
  $$('#fuel-seg .seg-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===fuelTab));
  $('#fuel-pane-log').hidden = fuelTab!=='log';
  $('#fuel-pane-recipes').hidden = fuelTab!=='recipes';
  if(fuelTab==='log'){
    $('#quick-grid').innerHTML=QUICK.map((f,i)=>`<button class="quick-item" data-i="${i}"><div class="quick-name">${f[0]}</div><div class="quick-macro">${f[1]} kcal · ${f[2]}g protein</div></button>`).join('');
    $$('#quick-grid .quick-item').forEach(b=>b.onclick=()=>{const f=QUICK[+b.dataset.i];addMeal({name:f[0],kcal:f[1],pro:f[2],carb:f[3],fat:f[4]});});
    renderTotals(); renderMealLog();
  } else {
    renderRecipes();
  }
}
function renderTotals(){
  const t=targets(profile);
  const meals=load(KEY.meals,{})[todayKey()]||[];
  const sum=k=>meals.reduce((s,m)=>s+(+m[k]||0),0);
  const cal=sum('kcal'), pro=sum('pro'), carb=sum('carb'), fat=sum('fat');
  $('#totals-bar').innerHTML=`
    <div class="total-cell"><div class="total-num ${t&&cal>t.calories?'over':''}">${cal}<small>${t?` / ${t.calories}`:''}</small></div><div class="total-label">calories</div></div>
    <div class="total-cell"><div class="total-num ${t&&pro>=t.protein?'good':''}">${pro}g<small>${t?` / ${t.protein}`:''}</small></div><div class="total-label">protein</div></div>
    <div class="total-cell"><div class="total-num">${carb}g<small>${t?` / ${t.carbs}`:''}</small></div><div class="total-label">carbs</div></div>
    <div class="total-cell"><div class="total-num">${fat}g<small>${t?` / ${t.fat}`:''}</small></div><div class="total-label">fat</div></div>`;
}
function renderMealLog(){
  const meals=load(KEY.meals,{})[todayKey()]||[];
  const box=$('#meal-log');
  if(!meals.length){box.innerHTML='<div class="empty-log">No meals logged yet today. Use quick add, a recipe, or the form.</div>';return;}
  box.innerHTML=meals.map((m,i)=>{
    const s=macroSplit(m);
    return `<div class="meal-item">
      ${m.photo?`<img class="meal-photo" src="${m.photo}" alt="">`:`<div class="meal-photo placeholder">◍</div>`}
      <div class="meal-info">
        <div class="meal-name">${escapeHTML(m.name)}</div>
        <div class="meal-macro">${m.kcal} kcal · ${m.pro||0}g P · ${m.carb||0}g C · ${m.fat||0}g F</div>
        <div class="macrobar"><span class="mb-p" style="width:${s.p}%"></span><span class="mb-c" style="width:${s.c}%"></span><span class="mb-f" style="width:${s.f}%"></span></div>
        <div class="macro-pct"><span class="dp">Protein ${s.p}%</span><span class="dc">Carbs ${s.c}%</span><span class="df">Fat ${s.f}%</span></div>
      </div>
      <button class="meal-del" data-i="${i}" aria-label="Delete">×</button></div>`;
  }).join('');
  $$('#meal-log .meal-del').forEach(b=>b.onclick=()=>delMeal(+b.dataset.i));
}
function addMeal(m){
  let carb=m.carb, fat=m.fat;
  if(carb==null||fat==null){ const d=deriveMacros(+m.kcal||0,+m.pro||0); carb=carb??d.carb; fat=fat??d.fat; }
  const all=load(KEY.meals,{}); const tk=todayKey();
  (all[tk]=all[tk]||[]).push({name:m.name,kcal:Math.round(+m.kcal||0),pro:Math.round(+m.pro||0),carb:Math.round(+carb||0),fat:Math.round(+fat||0),photo:m.photo||null});
  save(KEY.meals,all); renderTotals(); renderMealLog(); renderRings();
}
function delMeal(i){
  const all=load(KEY.meals,{}); const tk=todayKey();
  if(all[tk]){all[tk].splice(i,1);save(KEY.meals,all);}
  renderTotals(); renderMealLog(); renderRings();
}
function fileToThumb(file,cb){
  const r=new FileReader();
  r.onload=()=>{const img=new Image();img.onload=()=>{
    const max=520,scale=Math.min(1,max/Math.max(img.width,img.height));
    const c=document.createElement('canvas');c.width=img.width*scale;c.height=img.height*scale;
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',0.7));};img.src=r.result;};
  r.readAsDataURL(file);
}

/* ---------- recipes ---------- */
function renderRecipes(){
  const cats=[['all','All'],['high-protein','High protein'],['breakfast','Breakfast'],['quick','Quick'],['veggie','Veggie'],['meal-prep','Meal prep']];
  $('#recipe-filter').innerHTML=cats.map(([k,l])=>`<button class="chip ${k===recipeFilter?'active':''}" data-cat="${k}">${l}</button>`).join('');
  const items=RECIPES.filter(r=>recipeFilter==='all'||r.tags.includes(recipeFilter));
  $('#recipe-grid').innerHTML=items.map(r=>`
    <button class="recipe-card" data-id="${r.id}">
      <div class="recipe-top"><span class="recipe-kcal">${r.kcal}</span><span class="recipe-unit">kcal</span></div>
      <div class="recipe-body">
        <div class="recipe-name">${r.name}</div>
        <div class="recipe-meta">${r.pro}g protein · ${r.mins} min</div>
        <div class="recipe-tags">${r.tags.map(t=>`<span>${t}</span>`).join('')}</div>
      </div></button>`).join('');
  $$('#recipe-filter .chip').forEach(c=>c.onclick=()=>{recipeFilter=c.dataset.cat;renderRecipes();});
  $$('#recipe-grid .recipe-card').forEach(c=>c.onclick=()=>openRecipe(c.dataset.id));
}
function openRecipe(id){
  const r=RECIPES.find(x=>x.id===id); if(!r) return;
  $('#recipe-body').innerHTML=`
    <span class="tag accent">${r.kcal} kcal · ${r.pro}g protein · ${r.mins} min</span>
    <h2>${r.name}</h2>
    <h4>Ingredients</h4>
    <ul class="ing-list">${r.ing.map(i=>`<li>${i}</li>`).join('')}</ul>
    <h4>Method</h4>
    <ol class="step-list">${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    <button class="primary-btn wide" id="recipe-log">Log this meal (${r.kcal} kcal)</button>`;
  $('#recipe-log').onclick=()=>{addMeal({name:r.name,kcal:r.kcal,pro:r.pro});closeRecipe();fuelTab='log';showView('fuel');};
  $('#recipe-modal').hidden=false;
}
function closeRecipe(){ $('#recipe-modal').hidden=true; }

/* ---------- progress / stats ---------- */
let statMetric='weight';
const METRICS={
  weight:{label:'Bodyweight',unit:'kg',color:'var(--accent)',step:'0.1'},
  pushups:{label:'Best push-up set',unit:'reps',color:'var(--pro)',step:'1'},
  pullups:{label:'Best pull-up set',unit:'reps',color:'#7c9cff',step:'1'},
  sleep:{label:'Sleep',unit:'h',color:'#43d6c4',step:'0.5'},
  mood:{label:'Mood (1-5)',unit:'/5',color:'#ff9f43',step:'1'},
};
function getStat(m){ return (load(KEY.stats,{})[m]||[]).slice().sort((a,b)=>a.d<b.d?-1:1); }
function addStat(m,v){
  const all=load(KEY.stats,{}); const arr=all[m]||[]; const dk=todayKey();
  const ex=arr.find(e=>e.d===dk); if(ex) ex.v=v; else arr.push({d:dk,v});
  all[m]=arr; save(KEY.stats,all);
}
function journalSeries(field){
  const j=load(KEY.journal,{});
  return Object.keys(j).filter(d=>j[d] && j[d][field]!=null).sort().map(d=>({d,v:j[d][field]}));
}
function getSeries(m){ return (m==='sleep'||m==='mood') ? journalSeries(m) : getStat(m); }
function addMetric(m,v){
  if(m==='sleep'||m==='mood'){
    const dk=todayKey(); const all=load(KEY.journal,{});
    all[dk]=all[dk]||{}; all[dk][m]=v; all[dk].saved=true; save(KEY.journal,all);
  } else addStat(m,v);
}
function renderProgress(){
  $$('#stat-seg .seg-btn').forEach(b=>b.classList.toggle('active',b.dataset.metric===statMetric));
  const m=METRICS[statMetric]; const data=getSeries(statMetric);
  $('#stat-unit').textContent=m.unit;
  const sv=$('#stat-val'); sv.step=m.step; if(statMetric==='mood'){sv.min=1;sv.max=5;}else{sv.removeAttribute('max');sv.min=0;}
  const card=$('#chart-card');
  const latest=data.length?data[data.length-1].v:null;
  const first=data.length?data[0].v:null;
  const delta=(latest!=null&&first!=null&&data.length>1)?+(latest-first).toFixed(1):null;
  card.innerHTML=`
    <div class="chart-head">
      <div><div class="chart-metric">${m.label}</div>
      <div class="chart-now">${latest!=null?latest:'—'}<span> ${m.unit}</span></div></div>
      ${delta!=null?`<div class="chart-delta ${statMetric==='weight'?(delta<=0?'good':'up'):(delta>=0?'good':'up')}">${delta>0?'+':''}${delta} ${m.unit} since start</div>`:''}
    </div>
    ${lineChart(data,m.color)}
    ${data.length?`<div class="chart-dates"><span>${data[0].d}</span><span>${data[data.length-1].d}</span></div>`:''}`;
  renderRecaps();
}
function lineChart(series,color){
  if(!series||!series.length) return `<div class="chart-empty">No entries yet. Log your first one above to start the graph.</div>`;
  const W=640,H=200,pad=26;
  const vals=series.map(s=>s.v); let min=Math.min(...vals),max=Math.max(...vals);
  if(min===max){min-=1;max+=1;}
  const n=series.length;
  const X=i=>n===1?W/2:pad+(W-2*pad)*i/(n-1);
  const Y=v=>H-pad-(H-2*pad)*(v-min)/(max-min);
  const pts=series.map((s,i)=>[X(i),Y(s.v)]);
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=`M ${pad} ${H-pad} `+pts.map(p=>`L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')+` L ${W-pad} ${H-pad} Z`;
  const dots=pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" style="--c:${color}">
    <path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${dots}</svg>`;
}

/* ---------- weekly recap engine ---------- */
function recap(w){
  const start=parseKey(profile.start); const dates=[];
  for(let i=0;i<7;i++){const dd=new Date(start);dd.setDate(start.getDate()+(w-1)*7+i);dates.push(todayKey(dd));}
  const ticks=load(KEY.ticks,{}), meals=load(KEY.meals,{}), jr=load(KEY.journal,{}), t=targets(profile);
  let sessionsDone=0, calSum=0, calDays=0, proHit=0, sleepSum=0, sleepDays=0, moodSum=0, moodDays=0;
  for(const dk of dates){
    const sess=sessionForKey(dk); const idxs=countableIdx(sess); const tk=ticks[dk]||[];
    if(idxs.length && idxs.every(i=>tk.includes(i))) sessionsDone++;
    const dm=meals[dk]||[];
    if(dm.length){const c=dm.reduce((s,m)=>s+(+m.kcal||0),0);calSum+=c;calDays++;const pr=dm.reduce((s,m)=>s+(+m.pro||0),0);if(t&&pr>=t.protein)proHit++;}
    const jd=jr[dk];
    if(jd){ if(jd.sleep!=null){sleepSum+=jd.sleep;sleepDays++;} if(jd.mood!=null){moodSum+=jd.mood;moodDays++;} }
  }
  const wl=getStat('weight').filter(e=>e.d>=dates[0]&&e.d<=dates[6]);
  const wDelta=wl.length>=2?+(wl[wl.length-1].v-wl[0].v).toFixed(1):null;
  return {week:w,sessionsDone,totalSessions:7,avgCal:calDays?Math.round(calSum/calDays):null,proHit,wDelta,
          avgSleep:sleepDays?+(sleepSum/sleepDays).toFixed(1):null,avgMood:moodDays?+(moodSum/moodDays).toFixed(1):null,dates};
}
function renderRecaps(){
  const box=$('#recaps'); if(!box) return;
  const cur=weekNumber();
  if(cur<2){box.innerHTML='<div class="chart-empty">Your first weekly recap unlocks once you finish week 1.</div>';return;}
  let html='';
  for(let w=cur-1; w>=1; w--){
    const r=recap(w);
    html+=`<div class="recap-row">
      <div class="recap-row-week">Week ${r.week}</div>
      <div class="recap-row-stats">
        <span><b>${r.sessionsDone}/7</b> sessions</span>
        <span><b>${r.avgCal??'—'}</b> avg kcal</span>
        <span><b>${r.proHit}</b> protein days</span>
        <span><b>${r.avgSleep==null?'—':r.avgSleep+'h'}</b> sleep</span>
        <span><b>${r.wDelta==null?'—':(r.wDelta>0?'+':'')+r.wDelta+'kg'}</b></span>
      </div></div>`;
  }
  box.innerHTML=html;
}

/* ---------- profile ---------- */
function fillProfileForm(){
  if(!profile)return;
  $('#p-name').value=profile.name||''; $('#p-sex').value=profile.sex||'m';
  $('#p-age').value=profile.age||''; $('#p-height').value=profile.height||'';
  $('#p-weight').value=profile.weight||''; $('#p-activity').value=profile.activity||'1.725';
  $('#p-goal').value=profile.goal||'recomp';
  if($('#p-start')) $('#p-start').value=profile.start||todayKey();
  renderTargets();
}
function renderTargets(){
  const t=targets(profile); const card=$('#targets-card');
  if(!t){card.hidden=true;return;}
  card.hidden=false; const w=weekNumber();
  card.innerHTML=`
    <span class="tag accent">Your daily targets</span>
    <div class="targets-grid">
      <div class="target-stat"><div class="v">${t.calories}</div><div class="l">kcal / day</div></div>
      <div class="target-stat"><div class="v">${t.protein}g</div><div class="l">protein</div></div>
      <div class="target-stat"><div class="v">${t.carbs}g</div><div class="l">carbs</div></div>
      <div class="target-stat"><div class="v">${t.fat}g</div><div class="l">fat</div></div>
      <div class="target-stat"><div class="v">${w}</div><div class="l">current week</div></div>
    </div>
    <p class="card-note" style="margin-top:14px">Maintenance is about ${t.tdee} kcal. We set a slight ${Math.round((1-t.calories/t.tdee)*100)}% cut so you lose a little fat while still recovering and getting stronger. Protein is 1.8g per kg to protect muscle, fat 0.9g per kg, and the rest of your calories come from carbs to fuel kickbox and lifting.</p>`;
}

/* ===================================================================
   NAV + EVENTS
   =================================================================== */
const RENDER={today:renderToday,plan:renderPlan,moves:renderMoves,fuel:renderFuel,progress:renderProgress,you:()=>{}};
function showView(v){
  $$('.view').forEach(s=>s.classList.toggle('active',s.id==='view-'+v));
  $$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  $$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  (RENDER[v]||(()=>{}))();
  window.scrollTo({top:0,behavior:prefersReduced()?'auto':'smooth'});
}
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-view]');
  if(el){e.preventDefault();showView(el.dataset.view);}
});
$('#open-plan').onclick=()=>showView('plan');

/* fuel segmented control */
$$('#fuel-seg .seg-btn').forEach(b=>b.onclick=()=>{fuelTab=b.dataset.tab;renderFuel();});
/* stat segmented control */
$$('#stat-seg .seg-btn').forEach(b=>b.onclick=()=>{statMetric=b.dataset.metric;renderProgress();});

/* meal estimate + form */
$('#m-estimate').onclick=()=>{
  const est=estimate($('#m-name').value);
  $('#m-kcal').value=est.kcal||''; $('#m-pro').value=est.pro||'';
  const hint=$('#m-hint');
  hint.textContent = est.matched.length
    ? `Estimated from: ${est.matched.join(', ')} → ~${est.carb}g carbs, ${est.fat}g fat. Adjust if needed.`
    : 'Could not recognise foods. Type amounts like “200g chicken, 1 cup rice”, or enter numbers yourself.';
};
$('#m-photo').addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f)return;
  fileToThumb(f,url=>{const p=$('#m-preview');p.src=url;p.hidden=false;p.dataset.url=url;});
});
$('#meal-form').addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('#m-name').value.trim();
  let kcal=$('#m-kcal').value, pro=$('#m-pro').value;
  if(!name && !kcal) return;
  let carb, fat;
  if(name && !kcal){ const est=estimate(name); kcal=est.kcal; pro=est.pro; carb=est.carb; fat=est.fat; }
  addMeal({name:name||'Meal',kcal,pro,carb,fat,photo:$('#m-preview').dataset.url||null});
  e.target.reset(); const p=$('#m-preview'); p.hidden=true; p.removeAttribute('data-url'); $('#m-hint').textContent='';
});

/* daily check-in save */
$('#j-save').onclick=saveCheckin;

/* stat form */
$('#stat-form').addEventListener('submit',e=>{
  e.preventDefault();
  const v=parseFloat($('#stat-val').value); if(isNaN(v))return;
  addMetric(statMetric,v); $('#stat-val').value=''; renderProgress();
});

/* recipe modal close */
$('#recipe-modal').addEventListener('click',e=>{ if(e.target.id==='recipe-modal'||e.target.id==='recipe-close') closeRecipe(); });

/* profile form */
$('#profile-form').addEventListener('submit',e=>{
  e.preventDefault();
  profile={...(profile||{}),
    name:$('#p-name').value.trim(), sex:$('#p-sex').value, age:+$('#p-age').value,
    height:+$('#p-height').value, weight:+$('#p-weight').value,
    activity:$('#p-activity').value, goal:$('#p-goal').value,
    start:($('#p-start')&&$('#p-start').value)||profile?.start||todayKey()};
  save(KEY.profile,profile);
  // seed a first weight point if none
  if(profile.weight && !getStat('weight').length) addStat('weight',+profile.weight);
  renderTargets(); flash($('#profile-form').querySelector('button[type=submit]'),'✓ Saved');
});
function flash(btn,txt){const o=btn.textContent;btn.textContent=txt;setTimeout(()=>btn.textContent=o,1400);}

$('#reset-start').onclick=()=>{
  if(!confirm('Restart the plan from today? This resets the week counter AND clears your logged workouts, meals, weight log, check-ins and stats. Your body profile (name, height, weight, goal) stays.'))return;
  [KEY.ticks,KEY.meals,KEY.journal,KEY.stats].forEach(k=>localStorage.removeItem(k));
  if(profile){profile.start=todayKey();save(KEY.profile,profile); if(profile.weight) addStat('weight',+profile.weight);}
  fillProfileForm(); showView('today');
};

/* onboarding */
$('#onboard-go').onclick=()=>{$('#onboard').hidden=true;showView('you');};

/* reveal observer */
let io;
function observeReveals(){
  if(prefersReduced()){$$('.reveal').forEach(el=>el.classList.add('in'));return;}
  io=io||new IntersectionObserver(ents=>{ents.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:0.12});
  $$('.reveal:not(.in)').forEach(el=>io.observe(el));
}

/* ---------- boot ---------- */
function boot(){
  fillProfileForm();
  showView('today');
  observeReveals();
  if(!profile || !profile.weight){ $('#onboard').hidden=false; }
}
boot();
