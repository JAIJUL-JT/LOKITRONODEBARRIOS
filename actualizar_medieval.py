kimport os

files = {
    "css/style.css": """@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=MedievalSharp&display=swap');

:root {
    --oro-real: #d97706;
    --oro-brillante: #fbbf24;
    --hierro-oscuro: #1c1917;
    --pergamino-fondo: rgba(28, 25, 23, 0.92);
    --borde-oro: 2px solid #b45309;
}

body {
    font-family: 'MedievalSharp', cursive, Georgia, serif;
    background-color: #0c0a09;
    /* Fondo con ambientación de gran salón/taberna medieval */
    background-image: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), 
                      url('https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1920&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    color: #f5f5f4;
    margin: 0;
    padding: 0;
}

/* Cabecera Estandarte Real */
.hero {
    background: rgba(69, 10, 10, 0.85);
    border-bottom: 4px solid var(--oro-real);
    color: #fef08a;
    text-align: center;
    padding: 40px 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(4px);
}

.hero h1 {
    font-family: 'Cinzel', serif;
    font-size: 2.6rem;
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(217, 119, 6, 0.7);
    margin: 0 0 10px 0;
}

.hero p {
    font-style: italic;
    color: #e7e5e4;
    font-size: 1.15rem;
}

/* Tabernas y Pergaminos */
.container {
    max-width: 1050px;
    margin: 30px auto;
    padding: 0 20px;
}

.leaderboard-container {
    background: var(--pergamino-fondo);
    border: var(--borde-oro);
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 0 35px rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(6px);
}

.leaderboard-header h2 {
    font-family: 'Cinzel', serif;
    color: var(--oro-brillante);
    text-align: center;
    text-transform: uppercase;
    font-size: 1.8rem;
    margin-top: 0;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.leaderboard-table th {
    font-family: 'Cinzel', serif;
    background-color: #292524;
    color: var(--oro-brillante);
    border-bottom: 2px solid var(--oro-real);
    padding: 14px;
    text-transform: uppercase;
    font-size: 0.85rem;
}

.leaderboard-table td {
    padding: 16px;
    border-bottom: 1px solid #44403c;
    color: #f5f5f4;
}

.leaderboard-table tbody tr:hover {
    background-color: rgba(68, 64, 60, 0.4);
}

/* Botones con Sello Real */
.btn-cuervo {
    font-family: 'Cinzel', serif;
    background: linear-gradient(135deg, #78350f, #92400e);
    color: #fef08a;
    border: 1px solid var(--oro-brillante);
    padding: 12px 24px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.btn-cuervo:hover {
    background: var(--oro-real);
    color: #1c1917;
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
}

.score-badge {
    font-family: 'Cinzel', serif;
    font-weight: bold;
    color: var(--oro-brillante);
    background: #292524;
    border: 1px solid var(--oro-real);
    padding: 6px 12px;
    border-radius: 4px;
}""",
}

def aplicar_estetica_taberna():
    for file_path, content in files.items():
        os.makedirs(os.path.dirname(file_path), exist_ok=True) if "/" in file_path else None
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"🏰 Estética de la Taberna Real aplicada en: {file_path}")

if __name__ == "__main__":
    aplicar_estetica_taberna()
