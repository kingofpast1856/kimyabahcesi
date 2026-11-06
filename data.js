/* Ortak veri — oyun ve admin paneli aynı dosyayı kullanır (v4: dengelenmiş ekonomi) */
const RAR={common:{ad:"Yaygın",c:"#a9bba8",ch:1,q:[4,10],lv:1,sk:.2},uncommon:{ad:"Ender",c:"#6fcf5f",ch:.6,q:[2,6],lv:1,sk:.25},rare:{ad:"Nadir",c:"#3fb8af",ch:.3,q:[1,3],lv:3,sk:.3},legendary:{ad:"Efsanevi",c:"#f2c14e",ch:.1,q:[1,2],lv:6,sk:.35},mythic:{ad:"Mitik",c:"#ff5d8f",ch:.03,q:[1,1],lv:10,sk:.4},event:{ad:"Etkinlik",c:"#c58bff",ch:1,q:[1,3],lv:2,sk:.3}};
const NUT={N:{ad:"Azot (N)",e:"🟦"},P:{ad:"Fosfor (P)",e:"🟧"},K:{ad:"Potasyum (K)",e:"🟪"}};
const SYMP={N:"Yapraklar soluk sarı, büyüme yavaş (klorozis).",P:"Yapraklar morumsu, kökler zayıf, çiçek az.",K:"Yaprak kenarları kurumuş, meyve cılız."};
const PL={
marul:{ad:"Marul",e:"🥬",need:"N",price:11,seed:8,grow:90,kg:.4,rar:"common",col:"#7bd957",sh:"leaf",fact:"Yapraktaki yeşil renk klorofilden gelir; klorofilin ortasında magnezyum (Mg) atomu vardır."},
havuc:{ad:"Havuç",e:"🥕",need:"P",price:14,seed:10,grow:110,kg:.3,rar:"common",col:"#f08a24",sh:"root",fact:"Turuncu rengi karoten pigmentinden gelir."},
patates:{ad:"Patates",e:"🥔",need:"K",price:16,seed:12,grow:120,kg:.5,rar:"common",col:"#c9a26a",sh:"root",fact:"Patates, nişasta depolayan kalınlaşmış bir yeraltı gövdesidir."},
salatalik:{ad:"Salatalık",e:"🥒",need:"N",price:15,seed:11,grow:105,kg:.35,rar:"common",col:"#4cae4f",sh:"bush",fact:"Salatalığın yaklaşık %95'i sudur."},
sogan:{ad:"Soğan",e:"🧅",need:"P",price:12,seed:9,grow:95,kg:.3,rar:"common",col:"#e2b4d6",sh:"root",fact:"Soğan doğranınca açığa çıkan kükürtlü bir gaz gözleri yakar."},
domates:{ad:"Domates",e:"🍅",need:"P",price:55,seed:36,grow:200,kg:.5,rar:"uncommon",col:"#e4572e",sh:"bush",fact:"Kırmızı rengi likopen denen bir molekülden gelir."},
cilek:{ad:"Çilek",e:"🍓",need:"K",price:78,seed:52,grow:280,kg:.15,rar:"uncommon",col:"#ff5d8f",sh:"bush",fact:"Potasyum meyvenin tadını ve su dengesini düzenler."},
biber:{ad:"Biber",e:"🌶️",need:"K",price:66,seed:44,grow:240,kg:.1,rar:"uncommon",col:"#e63946",sh:"bush",fact:"Acılığı kapsaisin molekülünden gelir."},
patlican:{ad:"Patlıcan",e:"🍆",need:"N",price:72,seed:48,grow:260,kg:.4,rar:"uncommon",col:"#6a3d9a",sh:"bush",fact:"Mor rengi antosiyanindir; mor lahana gibi pH'a göre renk değiştirir."},
mantar:{ad:"Mantar",e:"🍄",need:"P",price:60,seed:40,grow:220,kg:.1,rar:"uncommon",col:"#d9c6a5",sh:"flower",fact:"Mantarlar bitki değildir; hücre duvarları kitinden oluşur."},
misir:{ad:"Mısır",e:"🌽",need:"N",price:250,seed:160,grow:480,kg:.6,rar:"rare",col:"#f2c14e",sh:"tall",fact:"Mısır çok azot ister; tarlalarda en çok azotlu gübre kullanılan bitkilerden biridir."},
karpuz:{ad:"Karpuz",e:"🍉",need:"K",price:410,seed:260,grow:650,kg:6,rar:"rare",col:"#3fb85f",sh:"melon",fact:"Karpuzun %92'si sudur."},
ananas:{ad:"Ananas",e:"🍍",need:"K",price:350,seed:220,grow:600,kg:1.5,rar:"rare",col:"#f2c14e",sh:"tall",fact:"Ananas, proteinleri parçalayan bromelain enzimi içerir."},
mango:{ad:"Mango",e:"🥭",need:"N",price:390,seed:240,grow:640,kg:.5,rar:"rare",col:"#ffb347",sh:"bush",fact:"Mango, A vitamininin öncülü olan karotenden zengindir."},
kivi:{ad:"Kivi",e:"🥝",need:"P",price:300,seed:190,grow:520,kg:.1,rar:"rare",col:"#7a9a3a",sh:"cluster",fact:"Kivi, proteini parçalayan aktinidin enzimi içerir."},
uzum:{ad:"Üzüm",e:"🍇",need:"P",price:1500,seed:900,grow:1000,kg:.8,rar:"legendary",col:"#8a5bd6",sh:"cluster",fact:"Mor rengi antosiyanin pigmentidir; pH'a göre renk değiştirir (lahana gibi)."},
hindistan:{ad:"Hindistan Cevizi",e:"🥥",need:"K",price:1850,seed:1100,grow:1100,kg:1.2,rar:"legendary",col:"#8d6e63",sh:"tall",fact:"İçindeki sıvı, potasyumca zengin doğal bir iyonik çözeltidir."},
seftali:{ad:"Şeftali",e:"🍑",need:"N",price:1350,seed:800,grow:900,kg:.3,rar:"legendary",col:"#ffab91",sh:"bush",fact:"Şeftali çekirdeği, odunsu sert bir kabuğun (taş) içindedir."},
ejder:{ad:"Ejder Meyvesi",e:"🐲",need:"N",price:7000,seed:4000,grow:1800,kg:1.2,rar:"mythic",col:"#ff3d7f",sh:"flower",fact:"Efsane! Ama o da fotosentezle büyür: 6CO₂ + 6H₂O → glikoz + 6O₂."},
elmas:{ad:"Elmas Çiçeği",e:"💎",need:"P",price:9200,seed:5200,grow:2000,kg:.2,rar:"mythic",col:"#b9f2ff",sh:"flower",fact:"Elmas ve grafit ikisi de karbondur; fark atomların dizilişindedir."},
plazma:{ad:"Plazma Lalesi",e:"🌷",need:"N",price:11500,seed:6500,grow:2200,kg:.3,rar:"mythic",col:"#ff4de1",sh:"flower",fact:"Plazma maddenin dördüncü halidir; Güneş ve şimşek plazmadır."},
neon:{ad:"Neon Nilüfer",e:"🪷",need:"N",price:600,seed:360,grow:420,kg:.3,rar:"event",col:"#35f0ff",sh:"flower",fact:"Neon, tepkimeye girmeyen soygazlardandır. Neon tabelaların ışığı gazın uyarılmasıyla çıkar."},
altinelma:{ad:"Altın Elma",e:"🍎",need:"K",price:1100,seed:660,grow:520,kg:.4,rar:"event",col:"#ffd24a",sh:"bush",fact:"Altın (Au) soy metaldir: paslanmaz, kolay tepkime vermez."},
kristalk:{ad:"Kristal Kaktüs",e:"🌵",need:"P",price:650,seed:390,grow:450,kg:.5,rar:"event",col:"#9be9ff",sh:"tall",fact:"Kristaller atomların düzenli dizilmesiyle oluşur."},
tuzgulu:{ad:"Tuz Gülü",e:"🌹",need:"K",price:1200,seed:720,grow:540,kg:.2,rar:"event",col:"#ff9bd0",sh:"flower",fact:"Sofra tuzu (NaCl), Na⁺ ve Cl⁻ iyonlarının oluşturduğu bir kristaldir."},
yildiz:{ad:"Yıldız Meyvesi",e:"⭐",need:"K",price:1800,seed:1080,grow:700,kg:.4,rar:"event",col:"#fff176",sh:"bush",fact:"Güneş'te hidrojen çekirdekleri birleşip helyum oluşturur (füzyon); yıldızlar böyle parlar."},
nebula:{ad:"Nebula Çiçeği",e:"🌸",need:"N",price:2300,seed:1380,grow:760,kg:.2,rar:"event",col:"#d58cff",sh:"flower",fact:"Nebulalar çoğunlukla hidrojen ve helyum gazı bulutlarıdır."},
isildayan:{ad:"Işıldayan Ayçiçeği",e:"🌻",need:"K",price:1000,seed:600,grow:480,kg:.5,rar:"event",col:"#d4ff3a",sh:"tall",fact:"Lüminesansta madde enerji alıp ışık olarak geri verir."},
bakir:{ad:"Bakır Yaprağı",e:"🌿",need:"N",price:800,seed:480,grow:420,kg:.3,rar:"event",col:"#2ec4b6",sh:"leaf",fact:"Bakır havayla tepkimeye girip yeşil bir patina tabakası oluşturur; Özgürlük Heykeli bu yüzden yeşildir."},
altinhavuc:{ad:"Altın Havuç",e:"🥕",need:"P",price:1300,seed:780,grow:500,kg:.3,rar:"event",col:"#ffd700",sh:"root",fact:"Altın çok işlenebilir bir metaldir: ince tel ve yaprak haline getirilebilir."}
};
const GR={
ure:{ad:"Üre",f:"CO(NH₂)₂",e:"🟦",price:5,kind:"fert",n:"N",ch:1,q:[5,12],d:"Azot (N) verir. Yaprak ve gövde büyümesi için."},
supfos:{ad:"Süperfosfat",f:"Ca(H₂PO₄)₂",e:"🟧",price:6,kind:"fert",n:"P",ch:1,q:[5,12],d:"Fosfor (P) verir. Kök ve çiçeklenme için."},
potas:{ad:"Potas",f:"KCl",e:"🟪",price:7,kind:"fert",n:"K",ch:1,q:[5,12],d:"Potasyum (K) verir. Meyve kalitesi ve su dengesi için."},
su:{ad:"Saf Su",f:"H₂O",e:"💧",price:3,kind:"boost",b:.1,ch:1,q:[6,14],d:"Bitkiye %10 ilerleme verir. Fazla tuzu seyreltir, her şeyi çözen çözücüdür."},
katalizor:{ad:"Katalizör Tozu",f:"Pt",e:"⚗️",price:50,kind:"boost",b:.35,ch:.4,q:[1,3],d:"Tepkimeyi tükenmeden hızlandırır: bitkiye %35 ilerleme."},
tampon:{ad:"Tampon Çözelti",f:"H₂PO₄⁻/HPO₄²⁻",e:"🫧",price:30,kind:"buf",ch:.5,q:[1,3],d:"pH değişimine direnir. Bitkiyi bir kez fazla gübre yanmasından korur."},
altin:{ad:"Altın Çözelti",f:"Au",e:"🏆",price:800,kind:"gold",ch:.1,q:[1,1],d:"Bitkiye Altın mutasyonu (×6) verir."},
kirec:{ad:"Kireç",f:"CaCO₃",e:"⚪",price:6,kind:"mat",ch:.8,q:[2,6],d:"Bazik bir tuz. Asidi nötrler. Sipariş ve deney malzemesi."},
kukurt:{ad:"Kükürt",f:"S",e:"🟡",price:6,kind:"mat",ch:.8,q:[2,6],d:"Toprakta bakteriler tarafından asite çevrilir. Sipariş ve deney malzemesi."},
indik:{ad:"Lahana İndikatörü",f:"antosiyanin",e:"🔮",price:8,kind:"mat",ch:.8,q:[2,6],d:"Mor lahana suyu; pH'a göre renk değiştirir. Sipariş malzemesi."},
tuz:{ad:"Sofra Tuzu",f:"NaCl",e:"🧂",price:4,kind:"mat",ch:.9,q:[3,8],d:"İyonik bileşik. Suda çözününce Na⁺ ve Cl⁻ olur. Sipariş ve deney malzemesi."},
co2:{ad:"CO₂ Tüpü",f:"CO₂",e:"☁️",price:10,kind:"mat",ch:.7,q:[2,5],d:"Karbondioksit. Fotosentezin hammaddesi. Sipariş ve deney malzemesi."},
mg:{ad:"Magnezyum Şeridi",f:"Mg",e:"🎇",price:14,kind:"mat",ch:.6,q:[1,4],d:"Parlak beyaz alevle yanan hafif metal. Sipariş ve deney malzemesi."},
azotg:{ad:"Azot Gazı Tüpü",f:"N₂",e:"🎈",price:12,kind:"mat",ch:.6,q:[1,4],d:"Havanın %78'i. Çok kararlı bir gaz. Sipariş ve deney malzemesi."},
npk:{ad:"NPK Karışımı",f:"N+P+K",e:"🌈",price:30,kind:"fx",craft:1,fx:{feed:"any",safe:1,boost:.15},d:"Üç elementi bir arada verir: bitkinin eksik elementini yanma riski olmadan sağlar, +%15 ilerleme."},
sivn:{ad:"Sıvı Azot",f:"CO(NH₂)₂(aq)",e:"🔷",price:12,kind:"fx",craft:1,fx:{feed:"N",safe:1},d:"Seyreltik üre çözeltisi: azotu yanma riski olmadan verir."},
sivp:{ad:"Sıvı Fosfor",f:"Ca(H₂PO₄)₂(aq)",e:"🔶",price:14,kind:"fx",craft:1,fx:{feed:"P",safe:1},d:"Seyreltik fosfat çözeltisi: fosforu yanma riski olmadan verir."},
sivk:{ad:"Sıvı Potasyum",f:"KCl(aq)",e:"🟣",price:16,kind:"fx",craft:1,fx:{feed:"K",safe:1},d:"Seyreltik potas çözeltisi: potasyumu yanma riski olmadan verir."},
foto:{ad:"Fotosentez Hızlandırıcı",f:"CO₂+H₂O+Pt",e:"🌞",price:45,kind:"fx",craft:1,fx:{speed:2,dur:240},d:"Bitki 4 dakika boyunca ×2 hızlı büyür."},
klor:{ad:"Klorofil Güçlendirici",f:"Mg+N+CO₂",e:"🍀",price:40,kind:"fx",craft:1,fx:{size:1.25},d:"Bitkinin büyüklüğünü ×1,25 yapar (en fazla 2,5)."},
muta:{ad:"Mutajen Çözelti",f:"NaCl+Pt+N₂",e:"🧬",price:60,kind:"fx",craft:1,fx:{mut:.6},d:"%60 ihtimalle rastgele bir mutasyon verir. Riskli deney: tutmazsa harcanır."},
kalkan:{ad:"Koruyucu Kalkan",f:"tampon+CaCO₃",e:"🛡️",price:35,kind:"fx",craft:1,fx:{buf:2},d:"Bitkiyi 2 kez fazla gübre yanmasından korur."},
duzel:{ad:"Toprak Düzeltici",f:"CaCO₃+S+H₂O",e:"🪴",price:20,kind:"fx",craft:1,fx:{heal:1,boost:.1},d:"Hasta bitkiyi iyileştirir (besin ihtiyacını giderir), +%10 ilerleme."}
};
const RCP={
npk:{in:["ure","supfos","potas"],q:1,k:"npkk",h:"Bitkilerin ihtiyaç duyduğu üç ana elementin üçünü de tek şişede topla."},
sivn:{in:["su","ure"],q:2,k:"seyrelt",h:"Azotlu bir gübreyi bir çözücüyle seyrelt."},
sivp:{in:["su","supfos"],q:2,k:"seyrelt",h:"Fosforlu bir gübreyi bir çözücüyle seyrelt."},
sivk:{in:["su","potas"],q:2,k:"seyrelt",h:"Potasyumlu bir gübreyi bir çözücüyle seyrelt."},
foto:{in:["co2","su","katalizor"],q:1,k:"foto",h:"Fotosentezin iki hammaddesi ve tepkimeyi hızlandıran bir madde."},
klor:{in:["mg","ure","co2"],q:1,k:"mg",h:"Klorofilin merkez atomu, bir azot kaynağı ve fotosentez gazı."},
muta:{in:["tuz","katalizor","azotg"],q:1,k:"mutajen",h:"Bir tuz, bir katalizör ve havanın en bol gazı."},
kalkan:{in:["tampon","kirec","su"],q:1,k:"tampon",h:"pH'ı sabit tutan çözelti, bazik bir tuz ve çözücü."},
duzel:{in:["kirec","kukurt","su"],q:1,k:"notr",h:"Bir baz kaynağı, bir asit kaynağı ve ikisini buluşturan çözücü."}
};
const MUT={
islak:{ad:"Islak",e:"💧",x:2,c:"#4aa8ff"},soklu:{ad:"Şoklu",e:"⚡",x:4,c:"#ffe34a"},donmus:{ad:"Donmuş",e:"🧊",x:3,c:"#9be9ff"},
fosforlu:{ad:"Fosforlu",e:"🟢",x:5,c:"#6dff5a"},gokkusagi:{ad:"Gökkuşağı",e:"🌈",x:8,c:"#ff7ad9"},altin:{ad:"Altın",e:"🟡",x:6,c:"#f2c14e"},
tozlu:{ad:"Tozlu",e:"💨",x:3,c:"#d9c9a3"},sisli:{ad:"Sisli",e:"🌫️",x:2,c:"#c9d6df"},kavrulmus:{ad:"Kavrulmuş",e:"🔥",x:3,c:"#ff8a3d"},
ayisikli:{ad:"Ay Işıklı",e:"🌙",x:4,c:"#cdd9ff"},kozmik:{ad:"Kozmik",e:"☄️",x:10,c:"#b48cff"},golge:{ad:"Gölgeli",e:"🌑",x:6,c:"#8a7fb0"}
};
const WX={
gunes:{id:"gunes",ad:"Güneşli",e:"☀️",g:1,mut:null,p:.30,d:"Normal hava. Fotosentez için ışık bol."},
yagmur:{id:"yagmur",ad:"Yağmur",e:"🌧️",g:1.4,mut:"islak",mc:1,p:.17,d:"Bitkiler %40 hızlı büyür. Islak mutasyonu (×2) gelebilir."},
firtina:{id:"firtina",ad:"Fırtına",e:"⛈️",g:1.1,mut:"soklu",mc:.8,p:.09,d:"Yıldırım havadaki azotu bağlar. Şoklu mutasyonu (×4) gelebilir."},
kirag:{id:"kirag",ad:"Kırağı",e:"❄️",g:.8,mut:"donmus",mc:.9,p:.09,d:"Büyüme yavaşlar. Donmuş mutasyonu (×3) gelebilir."},
asit:{id:"asit",ad:"Asit Yağmuru",e:"☣️",g:.8,mut:"fosforlu",mc:.7,p:.08,d:"Büyüme yavaşlar. Fosforlu mutasyonu (×5) gelebilir."},
aurora:{id:"aurora",ad:"Aurora",e:"🌌",g:1.2,mut:"gokkusagi",mc:.5,p:.03,d:"Çok nadir! Gökkuşağı mutasyonu (×8) gelebilir."},
ruzgar:{id:"ruzgar",ad:"Rüzgâr",e:"🌬️",g:1.1,mut:"tozlu",mc:1,p:.08,d:"Rüzgâr polen taşır. Tozlu mutasyonu (×3) gelebilir."},
sis:{id:"sis",ad:"Sis",e:"🌫️",g:.9,mut:"sisli",mc:1,p:.07,d:"Işık azalır, büyüme biraz yavaşlar. Sisli mutasyonu (×2) gelebilir."},
sicak:{id:"sicak",ad:"Sıcak Hava Dalgası",e:"🔥",g:1.25,mut:"kavrulmus",mc:.8,p:.06,d:"Sıcaklıkla tepkimeler hızlanır: %25 hızlı büyür. Kavrulmuş mutasyonu (×3) gelebilir."},
ay:{id:"ay",ad:"Dolunay",e:"🌕",g:1.15,mut:"ayisikli",mc:.6,p:.03,d:"Nadir! Ay Işıklı mutasyonu (×4) gelebilir."},
meteor:{id:"meteor",ad:"Meteor Yağmuru",e:"☄️",g:1,mut:"kozmik",mc:.25,p:.015,d:"Çok nadir! Kozmik mutasyonu (×10) gelebilir."},
tutulma:{id:"tutulma",ad:"Güneş Tutulması",e:"🌑",g:.7,mut:"golge",mc:.5,p:.02,d:"Işık azalır, büyüme yavaşlar. Gölgeli mutasyonu (×6) gelebilir."}
};
const WL=Object.values(WX),WSUM=WL.reduce((a,w)=>a+w.p,0);
const EV={
sen:{ad:"Periyodik Şenlik",e:"🎆",seeds:["neon","altinelma"],fx:{},d:"Şenlik tohumları dükkânda!"},
kristal:{ad:"Kristal Festivali",e:"💠",seeds:["kristalk","tuzgulu"],fx:{},d:"Kristal tohumları dükkânda!"},
kozmik:{ad:"Kozmik Gece",e:"🌠",seeds:["yildiz","nebula"],fx:{mut:2},d:"Mutasyon şansı ×2; kozmik tohumlar dükkânda."},
isilti:{ad:"Işıltı Gecesi",e:"✨",seeds:["isildayan"],fx:{mut:3},d:"Mutasyon şansı ×3; ışıldayan tohum dükkânda."},
kimyager:{ad:"Kimyagerler Haftası",e:"⚗️",seeds:["bakir"],fx:{xp:2,gdisc:.7},d:"XP ×2, lab malzemeleri %30 indirimli."},
hucum:{ad:"Altın Hücumu",e:"💰",seeds:["altinhavuc"],fx:{gold:6},d:"Altın mutasyon şansı ×6."},
sera:{ad:"Sera Günü",e:"🏡",seeds:[],fx:{g:1.5},d:"Tüm bitkiler %50 hızlı büyür."},
pazar:{ad:"Büyük Pazar",e:"🏪",seeds:[],fx:{sell:1.4},d:"Satış fiyatları %40 yüksek!"},
indirim:{ad:"Tohum İndirimi",e:"🏷️",seeds:[],fx:{sdisc:.7},d:"Tüm tohumlar %30 indirimli."}
};
const EVL=["sen","kristal","kozmik","kimyager","isilti","hucum","sera"];
const PETS={
tilki:{ad:"Katalizör Tilki",e:"🦊",fiyat:3000,lv:6,bilgi:"Katalizör tepkimeyi hızlandırır: bitkiler %50 hızlı büyür."},
kaplumbaga:{ad:"Tampon Kaplumbağa",e:"🐢",fiyat:2500,lv:5,bilgi:"Tampon, pH değişimine direnir: bitki 1 doz fazla gübreye dayanır."},
ari:{ad:"Tozlaşma Arısı",e:"🐝",fiyat:8000,lv:9,bilgi:"Çiçekler arıyla tozlaşır: yeni ekilen meyveler %12 daha büyük olur."},
baykus:{ad:"Mutasyon Baykuşı",e:"🦉",fiyat:12000,lv:12,bilgi:"Gece gözlemcisi: mutasyon şansı %30 artar."},
sincap:{ad:"Hasat Sincabı",e:"🐿️",fiyat:20000,lv:15,bilgi:"Olgunlaşan bitkileri senin yerine otomatik hasat eder."}
};
const CON={
tozlu:{t:"Tozlu mutasyonu",x:"Rüzgâr polenleri bir çiçekten diğerine taşır. Bazı bitkiler tozlaşmak için böceklere değil rüzgâra güvenir.",how:"Rüzgârda tozlu mutasyonu yakala."},
sisli:{t:"Sisli mutasyonu",x:"Sis, havadaki su buharının yoğuşup minik damlacıklara dönüşmesidir.",how:"Sisli havada sisli mutasyonu yakala."},
kavrulmus:{t:"Kavrulmuş mutasyonu",x:"Sıcaklık artınca moleküller hızlanır ve tepkimeler hızlanır. Ama çok sıcakta enzimler bozulur.",how:"Sıcak hava dalgasında kavrulmuş mutasyonu yakala."},
ayisikli:{t:"Ay Işıklı mutasyonu",x:"Ay kendi ışığını üretmez; Güneş ışığını yansıtır.",how:"Dolunayda ay ışıklı mutasyonu yakala."},
kozmik:{t:"Kozmik mutasyonu",x:"Meteorlar atmosferde sürtünmeyle ısınıp parlar. Çoğu demir ve nikel içerir.",how:"Meteor yağmurunda kozmik mutasyonu yakala."},
golge:{t:"Gölgeli mutasyonu",x:"Güneş tutulmasında ışık azalır; fotosentez yavaşlar.",how:"Güneş tutulmasında gölgeli mutasyonu yakala."},
npkk:{t:"NPK gübreleri",x:"Ticari gübrelerin çoğu üç elementi birden içerir. Paketin üstündeki üç sayı N-P-K oranını gösterir.",how:"Atölyede NPK Karışımı üret."},
seyrelt:{t:"Seyreltme ve derişim",x:"Aynı miktar madde daha çok çözücüde dağılırsa derişim düşer. Seyreltik gübre toprağın tuz derişimini fazla artırmaz, bitkiyi yakmaz.",how:"Atölyede bir Sıvı gübre üret."},
notr:{t:"Nötrleşme",x:"Asit ile baz tepkimeye girince tuz ve su oluşur; pH 7'ye yaklaşır.",how:"Atölyede Toprak Düzeltici üret."},
mutajen:{t:"Mutasyon",x:"Mutasyon, canlının genetik bilgisinde oluşan değişimdir. Çoğu zararsızdır, bazıları yeni özellikler getirir.",how:"Atölyede Mutajen Çözelti üret."},
azot:{t:"Azot (N)",x:"Azot; klorofilin ve proteinlerin yapısındadır. Eksikse yapraklar soluk sarı olur. Havanın %78'i azot gazıdır (N₂) ama bitki onu doğrudan kullanamaz.",how:"Azot eksikliği olan bir bitkiye Üre ver."},
fosfor:{t:"Fosfor (P)",x:"Fosfor, hücrede enerji taşıyan ATP'nin parçasıdır. Kök gelişimi ve çiçeklenme için gerekir. Eksikse yapraklar morumsu olur.",how:"Fosfor eksikliği olan bir bitkiye Süperfosfat ver."},
potasyum:{t:"Potasyum (K)",x:"Potasyum hücrelerin su dengesini ve meyve kalitesini düzenler. Eksikse yaprak kenarları kurur.",how:"Potasyum eksikliği olan bir bitkiye Potas ver."},
ozmos:{t:"Ozmos ve gübre yanığı",x:"Toprakta tuz derişimi artarsa su, bitkinin kökünden topraktaki derişik çözeltiye doğru çıkar (ozmos). Bitki susuzluktan yanar.",how:"Bir bitkiyi fazla gübreyle yak."},
ph:{t:"pH ölçeği",x:"pH, çözeltideki H⁺ miktarını gösterir. 7 nötr, 7'den küçük asit, büyük baz. Her 1 birim, 10 kat fark demektir. Çoğu bitki 6–7,5 arası sever.",how:"pH deneyini çöz."},
kirec:{t:"Kireç (CaCO₃)",x:"Kireç bazik bir tuzdur; asidi nötrler ve toprağın pH'ını yükseltir.",how:"Asidik toprak siparişini Kireç ile çöz."},
kukurt:{t:"Kükürt ve asitleşme",x:"Toprağa kükürt eklenince bakteriler onu sülfürik aside çevirir ve pH düşer. Bazik toprak için kullanılır.",how:"Bazik toprak siparişini Kükürt ile çöz."},
indik:{t:"Asit-baz indikatörü",x:"Mor lahanadaki antosiyanin pH'a göre renk değiştirir: asitte kırmızı/pembe, nötrde mor, bazda mavi-yeşil.",how:"İndikatör siparişini çöz."},
donma:{t:"Donma noktası alçalması",x:"Suya tuz gibi bir madde çözünce suyun donma noktası düşer. Karlı yollara tuz atılmasının sebebi budur.",how:"Tuz siparişini çöz."},
foto:{t:"Fotosentez",x:"Bitki, ışık enerjisiyle CO₂ ve suyu glikoza ve oksijene çevirir. CO₂ ne kadar çoksa (ışık yeterliyse) fotosentez o kadar hızlanır.",how:"CO₂ siparişini çöz."},
mg:{t:"Magnezyum ve klorofil",x:"Klorofil molekülünün tam ortasında bir magnezyum atomu vardır. Mg eksikse yapraklar solar.",how:"Magnezyum siparişini çöz."},
katalizor:{t:"Katalizör",x:"Katalizör, tepkimeyi hızlandırır ama kendisi tükenmez. Aktivasyon enerjisini düşürür.",how:"Katalizör siparişini çöz veya bir bitkiye katalizör ver."},
tampon:{t:"Tampon çözelti",x:"Tampon, az miktarda asit ya da baz eklendiğinde pH'ın değişmesine direnen çözeltidir. Kanımız da böyledir (pH ≈ 7,4).",how:"Tampon siparişini çöz veya bir bitkiyi Tampon ile koru."},
haber:{t:"Haber yöntemi",x:"N₂ çok kararlıdır. Haber yönteminde N₂ + 3H₂ → 2NH₃ (amonyak) üretilir. Gübrelerin çoğu bu amonyaktan yapılır.",how:"Azot gazı siparişini çöz."},
islak:{t:"Islak mutasyonu",x:"Su iyi bir çözücüdür; yağmurla mineraller çözünür ve köke ulaşır.",how:"Yağmurda ıslak mutasyonu yakala."},
soklu:{t:"Şoklu mutasyonu",x:"Yıldırımın sıcaklığı N₂ ile O₂'yi birleştirir (NO oluşur). Yağmurla toprağa nitrat olarak iner: doğal gübre!",how:"Fırtınada şoklu mutasyonu yakala."},
donmus:{t:"Donmuş mutasyonu",x:"Su donunca moleküller düzenli ve açık bir kafes yapar; hacim %9 artar. Buz bu yüzden suda yüzer.",how:"Kırağıda donmuş mutasyonu yakala."},
fosforlu:{t:"Fosforlu mutasyonu",x:"Bazı maddeler enerji alıp ışık olarak geri verir (lüminesans). Fosfor elementi de adını 'ışık taşıyan' anlamından alır.",how:"Asit yağmurunda fosforlu mutasyonu yakala."},
gokkusagi:{t:"Gökkuşağı mutasyonu",x:"Aurora'da yüksek enerjili parçacıklar atmosferdeki gaz atomlarını uyarır; atomlar farklı renklerde ışık yayar.",how:"Auroradan gökkuşağı mutasyonu yakala."},
altin:{t:"Altın mutasyonu",x:"Altın (Au) soy metaldir: havayla ve suyla tepkime vermez, paslanmaz.",how:"Altın mutasyonlu bir meyve topla."}
};
const ORD=[
{id:"o1",who:"Çiftçi Ayşe",e:"👩‍🌾",q:"Domateslerimin yaprakları mora çalıyor, kökleri çok zayıf. Hangi gübreyi vereyim?",h:"Kök ve çiçeklenme için gerekli element.",ok:["supfos"],w:{ure:"Üre azot verir: yaprak büyümesi içindir, kök için fosfor gerekir.",potas:"Potas meyve kalitesi içindir, kök gelişimi için değil."},y:"Fosfor kök gelişimini ve çiçeklenmeyi destekler.",c:"fosfor",rw:30},
{id:"o2",who:"Bahçıvan Mehmet",e:"👨‍🌾",q:"Marullarım soluk sarı ve bir türlü büyümüyor!",h:"Klorofil ve protein yapımı için gereken element.",ok:["ure"],w:{supfos:"Fosfor eksikliğinde yapraklar sarı değil morumsu olur.",potas:"Potasyum eksikliğinde yaprak kenarları kurur."},y:"Azot klorofilin ve proteinlerin parçasıdır; eksikse yapraklar solar.",c:"azot",rw:30},
{id:"o3",who:"Pazarcı Zehra",e:"🧑‍🌾",q:"Çileklerim cılız ve yaprak kenarları kurumuş. Ne vereyim?",h:"Su dengesini ve meyve kalitesini düzenleyen element.",ok:["potas"],w:{ure:"Azot yaprak büyümesini artırır ama kuruyan kenarlar potasyum eksikliğidir.",supfos:"Fosfor kök içindir."},y:"Potasyum hücrelerin su dengesini düzenler; eksikse yaprak kenarları kurur.",c:"potasyum",rw:30},
{id:"o4",who:"Çiftçi Hasan",e:"🧔",q:"Toprağımın pH'ı 4! Çok asidik. Nötrleştirmem lazım.",h:"Bazik bir tuz. Taş ocağında çıkar, tebeşirin ana maddesidir.",ok:["kirec"],w:{kukurt:"Kükürt toprağı daha da asitleştirir!",tuz:"Sofra tuzu nötr bir tuzdur, pH'ı pek değiştirmez."},y:"CaCO₃ bazik bir tuzdur; asitle tepkimeye girip onu nötrler.",c:"kirec",rw:35},
{id:"o5",who:"Yaşlı Fatma",e:"👵",q:"Toprağım aşırı bazik (pH 9), bitkilerim mineral alamıyor.",h:"Sarı renkli bir element; topraktaki bakteriler onu asite çevirir.",ok:["kukurt"],w:{kirec:"Kireç pH'ı daha da yükseltir. Zaten bazik!",tuz:"Tuz pH'ı düşürmez."},y:"Kükürt bakteriler aracılığıyla sülfürik aside dönüşür ve pH'ı düşürür.",c:"kukurt",rw:35},
{id:"o6",who:"Kimyager Deniz",e:"🧑‍🔬",q:"Şu sıvının asit mi baz mı olduğunu renkten anlamak istiyorum.",h:"Mor lahana suyu.",ok:["indik"],w:{su:"Saf su nötrdür ve renk değiştirmez, hiçbir şey göstermez.",tuz:"Tuz bir indikatör değildir."},y:"Antosiyanin asitte kırmızı, bazda mavi-yeşil olur.",c:"indik",rw:30},
{id:"o7",who:"Kış Bekçisi Kemal",e:"🧓",q:"Yollar buz tutacak. Suyun donma noktasını düşürmek için ne ekleyeyim?",h:"Mutfakta bulunur; suda Na⁺ ve Cl⁻ olarak çözünür.",ok:["tuz"],w:{su:"Saf su 0 °C'de donar.",kirec:"Kireç suda pek çözünmez."},y:"Çözünen madde suyun donma noktasını düşürür.",c:"donma",rw:30},
{id:"o8",who:"Seracı Nilüfer",e:"👩‍🔬",q:"Seramda fotosentezi hızlandırmak istiyorum. Havaya ne eklemeliyim?",h:"Bitki bu gazı alıp glikoz yapar.",ok:["co2"],w:{azotg:"Azot gazı bitkiye yaramaz, N₂ bitkinin kullanamayacağı kadar kararlıdır.",su:"Su da lazım ama havaya eklenmez."},y:"Fotosentez: CO₂ + H₂O + ışık → glikoz + O₂.",c:"foto",rw:30},
{id:"o9",who:"Profesör Zarbüstus",e:"🧙",q:"Klorofilin tam ortasındaki metal atomunu getir!",h:"Yanınca parlak beyaz alev verir, hafif bir metal.",ok:["mg"],w:{kirec:"Kalsiyum başka, klorofilin merkezinde değil.",kukurt:"Kükürt metal değildir."},y:"Klorofilin merkezinde magnezyum (Mg) atomu vardır.",c:"mg",rw:40},
{id:"o10",who:"Mühendis Burak",e:"👷",q:"Tepkimem çok yavaş. Kendisi tükenmeden hızlandıracak bir şey lazım.",h:"Platin (Pt) gibi bir madde.",ok:["katalizor"],w:{su:"Su tepkimeyi hızlandırmaz.",tuz:"Tuz bir katalizör değildir."},y:"Katalizör aktivasyon enerjisini düşürür ve tükenmez.",c:"katalizor",rw:40},
{id:"o11",who:"Eczacı Selin",e:"👩‍⚕️",q:"Çözeltime biraz asit damlasam bile pH'ın sabit kalmasını istiyorum.",h:"Zayıf asit ve eşlenik bazından oluşur.",ok:["tampon"],w:{su:"Su pH'ı nötre doğru seyreltir ama sabit tutmaz.",kirec:"Kireç pH'ı yükseltir."},y:"Tampon çözelti asit/baz eklenince pH değişimine direnir.",c:"tampon",rw:40},
{id:"o12",who:"Gübreci Kadir",e:"🧑‍🏭",q:"Havanın %78'ini oluşturan, Haber yöntemiyle amonyak yapılan gazı getir.",h:"N₂",ok:["azotg"],w:{co2:"CO₂ havanın yalnızca %0,04'ü.",su:"Su gaz değil."},y:"N₂ + 3H₂ → 2NH₃. Gübrelerin çoğu bu amonyaktan yapılır.",c:"haber",rw:45}
];
const lvlOf=xp=>Math.floor(Math.sqrt((xp||0)/20))+1;
