# McKinsey-Style CV Generator

Diese Web-Anwendung ermöglicht es Benutzern, professionelle Lebensläufe im McKinsey-Stil zu erstellen. Die Anwendung bietet eine dynamische Vorlage, die sich automatisch an unterschiedliche Mengen von Bildungs- und Berufserfahrungen anpasst.

## Funktionen

- Persönliche Daten (Name, Geburtsdatum, Nationalität, Kontaktinformationen)
- Ausbildung (mit flexibler Anzahl von Einträgen)
- Berufserfahrung (mit flexibler Anzahl von Einträgen)
- Außeruniversitäre Aktivitäten (mit flexibler Anzahl von Einträgen)
- Fähigkeiten, Aktivitäten und Interessen
- Responsibilities, Achievements or Projects für jeden Eintrag
- PDF-Export im exakten McKinsey-Stil
- OpenAI-Integration zur Verbesserung von Beschreibungen (jetzt mit dem `gpt-3.5-turbo` Modell für qualitativ hochwertigere Textverbesserungen)
- Modernisierte Benutzeroberfläche für verbesserte Benutzerfreundlichkeit und klareres Feedback.

## Installation

### Voraussetzungen

- Python 3.8 oder höher
- pip (Python-Paketmanager)

### Schritte

1. Klonen oder entpacken Sie das Projekt in ein Verzeichnis Ihrer Wahl

2. Erstellen Sie eine virtuelle Umgebung (optional, aber empfohlen):
   ```
   python -m venv venv
   ```

3. Aktivieren Sie die virtuelle Umgebung:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Installieren Sie die erforderlichen Abhängigkeiten:
   ```
   pip install -r requirements.txt
   ```

## Configuration

Before running the application, you need to set up your OpenAI API key:

1.  Create a file named `.env` in the root of the project (you can copy `.env.example`).
2.  Open the `.env` file and replace `"your_actual_openai_api_key_here"` with your actual OpenAI API key.
    Example: `OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
3.  The application will load this key when it starts.

**Important:** Keep your `.env` file private and do not commit it to version control. Add `.env` to your `.gitignore` file if it's not already there.

## Verwendung

1. Starten Sie die Anwendung:
   ```
   python -m src.main
   ```

2. Öffnen Sie einen Webbrowser und navigieren Sie zu:
   ```
   http://localhost:5000
   ```

3. Füllen Sie das Formular mit Ihren Daten aus

4. Klicken Sie auf "Preview CV", um eine Vorschau Ihres Lebenslaufs zu sehen

5. Klicken Sie auf "Export as PDF", um Ihren Lebenslauf als PDF-Datei zu exportieren

## Anpassung

- Die Vorlage kann in `src/templates/cv_template.html` angepasst werden
- Die Stile können in `src/static/css/style.css` angepasst werden
- Die Logik kann in `src/main.py` angepasst werden

## Fehlerbehebung

- Wenn die Anwendung nicht startet, stellen Sie sicher, dass Port 5000 nicht bereits verwendet wird
- Wenn der PDF-Export nicht funktioniert, stellen Sie sicher, dass WeasyPrint korrekt installiert ist
- Bei Problemen mit der OpenAI-Integration überprüfen Sie Ihren API-Schlüssel und dessen Konfiguration im `.env` File. Stellen Sie auch sicher, dass eine Internetverbindung besteht.

## Lizenz

Dieses Projekt ist für Ihren persönlichen Gebrauch bestimmt.
