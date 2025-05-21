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
- OpenAI-Integration zur Verbesserung von Beschreibungen

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

5. Konfigurieren Sie Ihren OpenAI API-Schlüssel:
   - Öffnen Sie die Datei `src/main.py`
   - Ersetzen Sie `"your-api-key-here"` mit Ihrem eigenen OpenAI API-Schlüssel
   - Wenn Sie keinen API-Schlüssel haben, funktioniert die Anwendung trotzdem, aber ohne die KI-Verbesserungsfunktion

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
- Bei Problemen mit der OpenAI-Integration überprüfen Sie Ihren API-Schlüssel

## Lizenz

Dieses Projekt ist für Ihren persönlichen Gebrauch bestimmt.
