# LA Neighborhood Recommender (HackEPS 2025)

## 💡 1. Visió General i El Valor Afegit Únic

Aquest projecte, desenvolupat durant el **HackEPS 2025**, resol el repte de Restb.ai creant un **prototip funcional** capaç de trobar el **barri ideal a Los Angeles** per a un grup de clients amb necessitats contrastades. (El sistema de proves es basa en els perfils psicològics dels personatges de *Joc de Trons*).

---

### 🎯 El Requisit Clau: El Motor de Justificació (Explainability)

La nostra solució va molt més enllà de la simple recomanació, centrant-se en el requisit més crític: la **Justificació (Explainability)**.

* **Què fem?** Utilitzem la intel·ligència artificial (**NLP**) per **interpretar el perfil psicològic** del client (a partir de text lliure) i combinem aquesta anàlisi amb un extens estudi de dades geoespacials de LA.
* **Valor Afegit:** El sistema no només recomana, sinó que mostra **exactament per què** un barri és el millor. Desglossa la puntuació final en la contribució percentual i absoluta de cada factor.

> **Exemple de Justificació:** "Aquesta zona va guanyar amb una puntuació de 9.8 en tranquil·litat, ja que la seva proximitat als espais verds compensa el nivell de soroll mitjà."



---

## 🧠 2. Arquitectura Tècnica i Flux Híbrid (IA + Matemàtica)

L'arquitectura utilitza un sistema híbrid que separa la **Interpretació (IA)** de la **Decisió (Càlcul Ponderat)** per garantir la màxima **fiabilitat i traçabilitat**.

### 2.1. El Nucli: De Text a Score Ponderat

El procés està dissenyat per gestionar l'**Input Semàntic** d'un client (incloent-hi el 'Client Secret') en 4 etapes clau:

1.  **Input Semàntic:** El text d'entrada es passa directament al mòdul d'IA.
2.  **NLP Zero-Shot Classification:** Un model **Transformer** (`distilbart-mnli`) analitza el text i genera un **Vector de Pesos** per a les categories de l'algoritme (Tranquil·litat, Lujo, Mobilitat, etc.).
3.  **Taxonomia Hardcodejada:** Un diccionari intern (Taxonomia) tradueix els **Pesos (Conceptes Humans)** a les **Columnes Tècniques** del *DataFrame*.
4.  **Algoritme de Decisió (Suma Ponderada):** S'aplica el càlcul final sobre els 99 barris.

### 2.2. Dades Geoespacials Integrades

Les recomanacions es basen en una combinació de dades de qualitat de **Los Angeles (99 *Certified Neighborhood Councils*)**:

* **Fronteres de Barris:** Polígons oficials de LA.
* **Lifestyle & Amenities:** Extracció detallada de POIs (bars, parcs, *coworking*, etc.) mitjançant la potent **Overpass API** (OpenStreetMap).
* **Mètriques Clau:** Integració de *datasets* avançats de **Soroll** i **Criminalitat** (LAPD/LA Open Data) per a una avaluació precisa.

---

## 💻 3. Implementació Tècnica i Desplegament

### 3.1. Stack Tecnològic

| Component | Eina | Propòsit Clau |
| :--- | :--- | :--- |
| **Core & ETL** | Python (**Pandas**, **GeoPandas**) | Processament de dades geoespacials i *Spatial Join* |
| **NLP Engine** | `transformers` | Interpretació del text del Client (Zero-Shot Classification) |
| **Dades Geo** | `requests` / Overpass QL | Descàrrega de dades d'OpenStreetMap (Punts d'Interès) |
| **Visualització** | React + Vite | Mapa interactiu i Panell de Justificació |

### 3.2. Passos per Executar (Local)

Per configurar i executar el projecte de manera local:

1.  **Instal·lació de Dependències:** Assegura't de tenir instal·lades totes les llibreries principals:
    ```bash
    pip install geopandas transformers requests pandas
    ```
2.  **Descàrrega del Model NLP:** Executa l'script de descàrrega per guardar localment el model `distilbart-mnli-12-3` a `./modelos/zero_shot_local` (per a funcionament **sense internet**).
3.  **Carrega de Dades (ETL):** Executa els scripts d'extracció i *spatial join* per omplir el *DataFrame* mestre de LA. (Aquest pas pot ser el més lent i només cal fer-lo una vegada).
4.  **Execució Final:** Executa el mòdul principal:
    ```bash
    python scoring_engine.py 
    # o bé 
    python app.py
    ```
    per obtenir la visualització interactiva i el Panell de Justificació.

---

## 🤝 4. Membres de l'Equip i Contacte

* **Hardware Engineer:** Enric Esteve Pons
* **AI Engineer:** Germán Puerto Rodríguez 
* **Data Anal Engineer:** Ivan Arenal
* **GUI Engineer:** Josep Lluis Marín

## 📄 Llicència

Aquest projecte està sota la Llicència **[Llicència (p. ex., MIT)]**. Consulta el fitxer `LICENSE` per a més detalls.
