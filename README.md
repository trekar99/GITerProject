# 🏘️ LA Neighborhood Recommender - El Motor de Justificación (HackEPS 2025)

## 🎯 1. Visió General i Objectiu del Repte

[cite_start]Aquest projecte resol el repte de Restb.ai creant un prototip funcional per trobar el **barri ideal a Los Angeles** per a un grup de clients amb necessitats contrastades (Basat en els personatges de Joc de Trons)[cite: 6, 7].

[cite_start]La nostra solució se centra en el requisit clau del repte: el **Motor de Justificació**[cite: 13]. Utilitzem la intel·ligència artificial (NLP) per entendre el perfil psicològic de cada client i combinem aquesta interpretació amb un extens anàlisi de dades geoespacials.

### El Requisit Clau: El Motor de Justificació

[cite_start]El sistema no només recomana, sinó que mostra exactament **per què** un barri és el millor, desglossant la puntuació final en la contribució de cada factor (p. ex., "Aquesta zona va guanyar per la seva puntuació de 9.8 en 'Seguretat'" [cite: 13]).

---

## 🧠 2. Arquitectura i Flux de Treball (The Hybrid Workflow)

L'arquitectura utilitza un sistema híbrid que separa la **Interpretació (IA)** de la **Decisió (Matemàtica)** per garantir la fiabilitat i la traçabilitat.

### 2.1. El Mòdul Central: IA + Suma Ponderada

[cite_start]El procés es divideix en 4 fases, assegurant la robustesa davant del **Client Secret**[cite: 84]:

1.  [cite_start]**Input Semàntic:** El text del client (o del Client Secret) [cite: 84] es passa directament al mòdul NLP.
2.  **NLP Zero-Shot Classification:** Un model Transformer (p. ex., `distilbart-mnli`) interpreta el text i genera un **Vector de Pesos** per a les 5 categories del projecte (Tranquil·litat, Lujo, Mobilitat, etc.).
    * *Filtre d'Indiferència:* Els pesos inferiors a un umbral (ej. 0.25) es forcen a zero, evitant que temes irrellevants (indiferència) contaminin el càlcul.
3.  [cite_start]**Taxonomia Hardcodejada:** Un diccionari intern (Taxonomia) tradueix els **Pesos (Conceptes Humans)** a les **Columnes Tècniques** del DataFrame (ej: Tranquil·litat → `nivell_soroll_invers` [cite: 63]).
4.  **Algoritme de Decisió:** S'utilitza el model de **Suma Ponderada** per calcular l'Score Final per als 99 barris:
    $$Score_{Final} = \sum (Pes_{IA} \times Valor_{Normalitzat})$$

### 2.2. Dades Geoespacials

[cite_start]Les recomanacions es basen en la combinació de dades de les següents fonts, prioritzant la qualitat[cite: 82]:

* [cite_start]**Fronteres de Barris:** Polígons oficials dels 99 *Certified Neighborhood Councils* de Los Angeles[cite: 51].
* [cite_start]**Lifestyle & Amenities:** Extracció detallada de punts d'interès (bars, parcs, coworking, etc.) mitjançant la **Overpass API** (OpenStreetMap)[cite: 47, 50].
* [cite_start]**Mètriques Clau:** S'integren els *datasets* avançats de **Soroll** (per a Bran/Cersei) i de **Criminalitat** (LAPD/LA Open Data)[cite: 43, 63].

---

## 💻 3. Implementació Tècnica i Desplegament

### 3.1. Stack Tecnològic

| Component | Eina | Propòsit |
| :--- | :--- | :--- |
| **Core & ETL** | Python (Pandas, GeoPandas) | Processament de dades i *Spatial Join* |
| **NLP Engine** | `transformers` (Zero-Shot Classification) | Interpretació del text del Client Secret |
| **APIs** | `requests` / Overpass QL | Descàrrega de dades geoespacials (Punts) |
| **Visualització** | Matplotlib / Folium / [Nom del teu Framework UI/Desplegament] | Mapa de calor i Panell de Justificació |

### 3.2. Passos per Executar (Local)

1.  **Instal·lació:** Assegura't de tenir totes les dependències (`pip install geopandas transformers requests`).
2.  **Descàrrega del Model:** Executa el script de descàrrega per tenir el model `distilbart-mnli-12-3` guardat a la carpeta `./modelos/zero_shot_local` (funcionament sense internet).
3.  **Carrega de Dades:** Executa els scripts d'extracció per omplir el DataFrame mestre amb les dades de Los Angeles (el *spatial join* és la part més lenta i només es fa una vegada).
4.  **Execució Final:** Executa el mòdul principal (`app.py` o `scoring_engine.py`) per obtenir la visualització interactiva i el Panell de Justificació.

---

## 🤝 4. Membres de l'Equip i Contacte

* **Desenvolupador Principal:** [El teu Nom/Alias de GitHub] ([Enllaç al teu perfil de GitHub])
* **Contacte:** [El teu correu electrònic o enllaç de LinkedIn]

## 📄 Llicència

Aquest projecte està sota la Llicència [Llicència (p. ex., MIT)]. Consulta el fitxer `LICENSE` per a més detalls.
