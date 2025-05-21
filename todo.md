# CV Generator Web App - Todo Liste

## Anforderungen
- [x] Anforderungen mit dem Nutzer klären
- [x] Beispiel-Lebenslauf analysieren
- [x] Passende Web-App-Vorlage auswählen und initialisieren
- [x] Benötigte Abhängigkeiten installieren (WeasyPrint, OpenAI)

## Implementierung
- [x] Frontend-Struktur erstellen
  - [x] HTML-Grundgerüst für einseitige Benutzeroberfläche
  - [x] CSS für McKinsey-Stil Layout
  - [x] JavaScript für dynamische Formularfelder
- [x] Backend-Logik implementieren
  - [x] Datenmodell für CV-Informationen
  - [x] Routen für Formularverarbeitung
  - [x] PDF-Export-Funktionalität
  - [x] OpenAI-Integration für Projektbeschreibungen
- [x] Dynamische CV-Vorlage erstellen
  - [x] Persönliche Daten Abschnitt
  - [x] Ausbildung Abschnitt (dynamisch erweiterbar)
  - [x] Berufserfahrung Abschnitt (dynamisch erweiterbar)
  - [x] Außeruniversitäre Aktivitäten Abschnitt (dynamisch erweiterbar)
  - [x] Fähigkeiten, Aktivitäten und Interessen Abschnitt

## Erweiterungen (nach Nutzerfeedback - Runde 1)
- [x] Typografische Verbesserungen
  - [x] Schriftart-Anpassungen (Times New Roman, 12pt)
  - [x] Zeilenabstände optimieren (einfacher Zeilenabstand)
  - [x] Formatierungsoptionen (fett, kursiv) hinzufügen
  - [x] Spezifische Formatierungen für Abschnitte (Name, Institution, Position etc.)
- [x] Projektstruktur verbessern
  - [x] Tab-Navigation für bessere Übersicht
  - [x] Möglichkeit, mehrere Projekte pro Bildungsabschnitt hinzuzufügen
  - [x] Projekte auch für Berufserfahrung und Aktivitäten ermöglichen

## Erweiterungen (nach Nutzerfeedback - Runde 2)
- [x] Seitenlayout anpassen
  - [x] Exakte Seitenränder aus Beispiel übernehmen (oben 1,9cm, unten 1,4cm, links/rechts 1,9cm)
  - [x] US Letter Format (21,6 × 27,9 cm) beibehalten
- [x] Projektdarstellung korrigieren
  - [x] Fehler bei der Projektanzeige beheben
  - [x] Projekte als Bulletpoints unter Degree/Role darstellen
- [x] Bulletpoint-Formatierung
  - [x] Alle Inhalte unter Degree/Role als Bulletpoints formatieren
  - [x] Korrekte Einrückung und Formatierung der Aufzählungspunkte

## Erweiterungen (nach Nutzerfeedback - Runde 3)
- [x] PDF-Export korrigieren
  - [x] Verschiebung nach rechts im PDF beheben
  - [x] @page CSS-Regeln für korrekte Zentrierung implementieren
- [x] Projektstruktur vereinfachen
  - [x] Separate "Projects"-Kategorie entfernen
  - [x] Gemeinsame "Responsibilities, Achievements or Projects"-Kategorie einführen
  - [x] Mehrfacheinträge für Responsibilities ermöglichen
- [x] Schriftartauswahl entfernen
  - [x] Unnötige Formatierungsoptionen entfernen
  - [x] Times New Roman als feste Schriftart festlegen

## Testen und Bereitstellen
- [x] Lokales Testen der Anwendung
- [x] Deployment vorbereiten
- [x] Anwendung bereitstellen
- [x] Zugang an Nutzer senden
