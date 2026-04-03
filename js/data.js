/* ============================================================
   PeptideLab – Product Data
   ============================================================ */

window.PRODUCTS = [
  {
    id: 1,
    name: 'BPC-157',
    fullName: 'BPC-157 (Body Protection Compound)',
    category: 'healing',
    categoryLabel: 'Heilung & Regeneration',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.9,
    reviews: 234,
    badge: 'Bestseller',
    badgeType: 'bestseller',
    description: 'BPC-157 ist ein aus dem Magenproteinsaft isoliertes Pentadekapeptid mit außergewöhnlichen regenerativen Eigenschaften. In Forschungsstudien zeigte es bemerkenswerte Ergebnisse bei der Gewebeheilung.',
    longDescription: `<p>BPC-157, auch bekannt als Body Protection Compound 157, ist ein synthetisches Peptid, das aus einem 15-Aminosäuren-Segment des menschlichen Magenproteins abgeleitet wurde. In zahlreichen präklinischen Studien hat dieses Peptid bemerkenswerte Eigenschaften bei der Beschleunigung der Gewebeheilung demonstriert.</p>
    <p>Die Forschungsergebnisse deuten darauf hin, dass BPC-157 die Angiogenese fördert, also die Bildung neuer Blutgefäße, was für die Gewebereparatur entscheidend ist. Darüber hinaus wurden in Tierstudien positive Effekte auf Sehnen, Bänder, Muskeln und Darmgewebe beobachtet.</p>
    <p>Besonders interessant für die wissenschaftliche Gemeinschaft sind die Beobachtungen zur systemischen Wirkung des Peptids – es scheint nicht nur lokal, sondern im gesamten Organismus zu wirken. Forschungen zeigen außerdem potenzielle neuroprotektive Eigenschaften.</p>
    <p>Alle hier bereitgestellten Informationen dienen ausschließlich wissenschaftlichen und Forschungszwecken. BPC-157 ist nicht für den menschlichen Konsum bestimmt und befindet sich noch in der präklinischen Forschungsphase.</p>`,
    researchInfo: `<h4>Forschungsübersicht</h4>
    <p>BPC-157 wurde in über 100 präklinischen Studien untersucht. Die Forschung konzentriert sich auf folgende Bereiche:</p>
    <ul>
      <li>Gastrointestinale Heilung und Schutz der Magenschleimhaut</li>
      <li>Muskel- und Sehnenheilung in Tiermodellen</li>
      <li>Angiogenese und Gefäßbildung</li>
      <li>Neuroprotektive Wirkungen in Nagetiermodellen</li>
      <li>Entzündungsmodulation und oxidativer Stress</li>
    </ul>
    <p>CAS-Nummer: 137525-51-0 | Reinheit: ≥99,5% (HPLC-verifiziert) | Sequenz: Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Die folgenden Informationen sind ausschließlich für Forschungszwecke bestimmt und stellen keine medizinische Beratung dar. BPC-157 ist nicht für den menschlichen Konsum zugelassen.</p>
    <h4>Forschungsprotokoll (Tiermodelle)</h4>
    <ul>
      <li>Standarddosis in Studien: 1–10 µg/kg Körpergewicht</li>
      <li>Applikationsrouten in Studien: subkutan, intraperitoneal, oral</li>
      <li>Lösungsmittel: steriles Wasser oder bacteriostatisches Wasser</li>
      <li>Lagerung: lyophilisiert bei -20°C, nach Rekonstitution bei 4°C (3–5 Tage)</li>
    </ul>`,
    purity: '99.5%',
    format: '5mg',
    molecular: 'C62H98N16O22',
    weight: '1419.5 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '🧬',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #0c2545 50%, #0a3060 100%)',
    glowColor: 'rgba(0, 100, 255, 0.2)',
  },
  {
    id: 2,
    name: 'TB-500',
    fullName: 'TB-500 (Thymosin Beta-4 Fragment)',
    category: 'healing',
    categoryLabel: 'Heilung & Regeneration',
    price: 59.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 187,
    badge: 'Neu',
    badgeType: 'new',
    description: 'TB-500 ist ein synthetisches Fragment von Thymosin Beta-4, das in Forschungsstudien eine Rolle bei der Zellmigration, Proliferation und Differenzierung spielt. Ein wichtiges Forschungspeptid.',
    longDescription: `<p>TB-500 ist das synthetische Analogon des aktiven Bereichs von Thymosin Beta-4, einem Protein, das in fast allen tierischen Zellen vorkommt. Thymosin Beta-4 ist an der Regulation von Aktin, einem Strukturprotein, beteiligt und spielt eine wichtige Rolle bei der Zellentwicklung und -heilung.</p>
    <p>In präklinischen Studien hat TB-500 bemerkenswerte Eigenschaften in der Förderung der Gewebeheilung gezeigt. Besonders untersucht wurden seine Effekte auf Herzgewebe, Skelettmuskulatur, Sehnen und Blutgefäße. Die Forschung deutet auf eine Schlüsselrolle bei der Angiogenese hin.</p>
    <p>Ein bedeutender Vorteil in Forschungsmodellen ist die scheinbare Fähigkeit von TB-500, durch das Gewebe zu wandern und systemisch zu wirken – was es von lokalen Wachstumsfaktoren unterscheidet.</p>
    <p>Alle Daten entstammen präklinischen Studien. TB-500 ist nicht für diagnostische oder therapeutische Anwendungen beim Menschen bestimmt.</p>`,
    researchInfo: `<h4>Wissenschaftlicher Hintergrund</h4>
    <p>TB-500 entspricht der Aminosäuresequenz 17–23 von Thymosin Beta-4, dem entscheidenden aktiven Bereich des Moleküls. Forschungsschwerpunkte:</p>
    <ul>
      <li>Herzmuskelregeneration in Infarktmodellen</li>
      <li>Wundheilung und dermale Regeneration</li>
      <li>Augenerkrankungen und Hornhautregeneration</li>
      <li>Haarfollikelaktivierung</li>
      <li>Entzündungsmodulation</li>
    </ul>
    <p>CAS-Nummer: 77591-33-4 | Sequenz: Ac-LKKTETQ | Reinheit: ≥99%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Nur für Forschungszwecke. Nicht für den menschlichen Konsum.</p>
    <h4>Forschungsprotokoll (Tiermodelle)</h4>
    <ul>
      <li>Dosierung in Studien: 2,0–2,5 mg/kg in akuten Modellen</li>
      <li>Chronische Modelle: 1,0 mg/kg zweimal wöchentlich</li>
      <li>Lösungsmittel: Bacteriostatisches oder steriles Wasser</li>
      <li>Stabilität: 12 Monate lyophilisiert bei -20°C</li>
    </ul>`,
    purity: '99.0%',
    format: '10mg',
    molecular: 'C212H350N56O78S',
    weight: '4963.5 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '💪',
    gradient: 'linear-gradient(135deg, #042222 0%, #064040 50%, #085555 100%)',
    glowColor: 'rgba(0, 180, 160, 0.2)',
  },
  {
    id: 3,
    name: 'Ipamorelin',
    fullName: 'Ipamorelin (Selektiver GH-Sekretagog)',
    category: 'growth',
    categoryLabel: 'Wachstum & GH-Achse',
    price: 44.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 156,
    badge: null,
    badgeType: null,
    description: 'Ipamorelin ist ein selektiver Wachstumshormon-Sekretagog der fünften Generation. In Forschungsstudien zeigt es eine hochselektive GH-Freisetzung ohne signifikante Auswirkungen auf Cortisol oder Prolaktin.',
    longDescription: `<p>Ipamorelin ist ein pentapeptidischer Wachstumshormon-Sekretagog, der als Ghrelin-Rezeptor-Agonist wirkt (GHSR-1a). Es wurde als eines der selektivsten Peptide seiner Klasse entwickelt, mit dem Vorteil einer spezifischen GH-Freisetzung bei minimalem Einfluss auf andere endokrine Parameter.</p>
    <p>Im Gegensatz zu älteren Wachstumshormon-Sekretagogen wie GHRP-2 und GHRP-6 zeigt Ipamorelin in Forschungsmodellen keine signifikante Stimulation von Cortisol, Prolaktin oder Aldosteron. Diese Selektivität macht es zu einem wertvollen Forschungsinstrument.</p>
    <p>Studien an Tiermodellen haben gezeigt, dass Ipamorelin die Wachstumshormon-Pulse auf eine physiologischere Weise imitiert als ältere Analoga, was für die Grundlagenforschung zur GH-Achse bedeutsam ist.</p>
    <p>Sämtliche Informationen dienen ausschließlich Forschungszwecken. Ipamorelin ist nicht für therapeutische Anwendungen zugelassen.</p>`,
    researchInfo: `<h4>Pharmakologisches Profil</h4>
    <p>Ipamorelin (Aib-His-D-2-Nal-D-Phe-Lys-NH2) ist ein selektiver GHSR-Agonist der 5. Generation:</p>
    <ul>
      <li>Hohe GH-Selektivität: kein signifikanter Anstieg von ACTH, Cortisol, Prolaktin</li>
      <li>Dosisabhängige GH-Freisetzung in Nagetiermodellen</li>
      <li>Synergistisch mit CJC-1295 in kombinierten Protokollen</li>
      <li>Halbwertszeit: ~2 Stunden in Tiermodellen</li>
      <li>Bioaktivität: oral inaktiv, parenteral aktiv</li>
    </ul>
    <p>CAS-Nummer: 170851-70-4 | Reinheit: ≥99%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Ausschließlich für Laborforschung. Kein Humanarzneimittel.</p>
    <h4>Studienprotokoll (in vivo Tiermodelle)</h4>
    <ul>
      <li>Standarddosis: 200–300 µg/kg subkutan</li>
      <li>Verabreichungszeitpunkte: nüchtern oder prä-schlaf (circadianer Rhythmus)</li>
      <li>Häufig kombiniert mit GHRH-Analoga in Forschungsdesigns</li>
      <li>Lagerung: Lyophilisat -20°C; Lösung 4°C max. 7 Tage</li>
    </ul>`,
    purity: '99.2%',
    format: '5mg',
    molecular: 'C38H49N9O5',
    weight: '711.9 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '📈',
    gradient: 'linear-gradient(135deg, #1a0533 0%, #2d0a55 50%, #3b1070 100%)',
    glowColor: 'rgba(139, 92, 246, 0.25)',
  },
  {
    id: 4,
    name: 'CJC-1295 DAC',
    fullName: 'CJC-1295 mit DAC (Drug Affinity Complex)',
    category: 'growth',
    categoryLabel: 'Wachstum & GH-Achse',
    price: 54.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 201,
    badge: null,
    badgeType: null,
    description: 'CJC-1295 DAC ist ein langwirksames GHRH-Analogon mit Drug Affinity Complex-Technologie. Es verlängert die Halbwertszeit auf 6–8 Tage und ermöglicht anhaltende GH-Freisetzung in Forschungsmodellen.',
    longDescription: `<p>CJC-1295 mit DAC (Drug Affinity Complex) ist ein modifiziertes GHRH-Analogon, das durch die Bindung an Blutproteine eine dramatisch verlängerte Wirkdauer aufweist. Während natives GHRH nur Minuten im Kreislauf verbleibt, zeigt CJC-1295 DAC in Tiermodellen eine Halbwertszeit von 6–8 Tagen.</p>
    <p>Diese verlängerte Wirkdauer ermöglicht in der Forschung wöchentliche Dosierungsprotokoll, was CJC-1295 DAC von anderen GHRH-Analoga unterscheidet. In Studien wurde eine konsistente Erhöhung der GH- und IGF-1-Spiegel in Tiermodellen beobachtet.</p>
    <p>Die DAC-Technologie basiert auf einer reaktiven Malemid-Seitenkette, die eine kovalente Bindung an Cys34 von Albumin im Blut ermöglicht, was die proteolytische Degradation verhindert.</p>
    <p>Alle Daten entstammen Laborstudien. CJC-1295 DAC ist kein Arzneimittel und nicht für den menschlichen Gebrauch bestimmt.</p>`,
    researchInfo: `<h4>Technologische Grundlage</h4>
    <p>CJC-1295 mit DAC repräsentiert die fortschrittlichste GHRH-Analogon-Technologie:</p>
    <ul>
      <li>DAC-Modifikation: Maleimid-Gruppe ermöglicht Albumin-Bindung</li>
      <li>Halbwertszeit: 6–8 Tage (vs. Minuten für GHRH)</li>
      <li>Dosierungsintervall in Studien: 1× pro Woche möglich</li>
      <li>Synergistisch mit GHRP-Peptiden (Ipamorelin, GHRP-2/6)</li>
      <li>Potenziert die pulsierende GH-Freisetzung in Tiermodellen</li>
    </ul>
    <p>CAS-Nummer: 863288-34-0 | Reinheit: ≥98.5%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Nur für Forschungszwecke. Nicht für den menschlichen Konsum.</p>
    <h4>Studienprotokoll (Nagermodelle)</h4>
    <ul>
      <li>Einmaldosis in Studien: 1–2 mg/kg</li>
      <li>Applikationsintervall: 1× wöchentlich (DAC-Formulierung)</li>
      <li>Kombination mit GHRP in Studien: zeitgleiche Applikation</li>
      <li>Lagerung: -20°C lyophilisiert; Lösungsstabilität 5–7 Tage bei 4°C</li>
    </ul>`,
    purity: '98.5%',
    format: '2mg',
    molecular: 'C152H252N44O42',
    weight: '3367.9 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '⚡',
    gradient: 'linear-gradient(135deg, #062010 0%, #0a3520 50%, #0d4828 100%)',
    glowColor: 'rgba(0, 200, 100, 0.2)',
  },
  {
    id: 5,
    name: 'Sermorelin',
    fullName: 'Sermorelin (GHRH 1-29)',
    category: 'growth',
    categoryLabel: 'Wachstum & GH-Achse',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.6,
    reviews: 143,
    badge: 'Sale',
    badgeType: 'sale',
    description: 'Sermorelin ist das erste 29 Aminosäuren lange Fragment von endogenem GHRH. Es stimuliert die hypophysäre GH-Freisetzung auf physiologische Weise und ist ein etabliertes Werkzeug in der Wachstumshormon-Forschung.',
    longDescription: `<p>Sermorelin (GHRH 1-29 NH2) ist das N-terminale biologisch aktive Fragment des Wachstumshormon-Releasing-Hormons (GHRH). Mit seinen 29 Aminosäuren umfasst es die minimale Sequenz, die für die volle biologische Aktivität des GHRH-Rezeptors erforderlich ist.</p>
    <p>Als das am längsten erforschte GHRH-Analogon verfügt Sermorelin über eine umfangreiche Literaturgrundlage. Es stimuliert die Hypophyse zur pulsatilen GH-Freisetzung, was einen physiologischeren Wirkmechanismus darstellt als exogenes Wachstumshormon.</p>
    <p>In Forschungsmodellen wurde Sermorelin ausgiebig zur Untersuchung der somatotropen Achse eingesetzt. Die Forschung zeigt eine kurze Halbwertszeit von etwa 10-20 Minuten in vivo, was mehrfache tägliche Applikationen in Langzeitstudien erfordert.</p>
    <p>Alle Informationen dienen rein wissenschaftlichen Zwecken. Sermorelin ist für Forschungslabors bestimmt.</p>`,
    researchInfo: `<h4>Forschungsstatus & Wissenschaft</h4>
    <p>Sermorelin ist eines der am besten charakterisierten GHRH-Analoga in der Forschung:</p>
    <ul>
      <li>Physiologischer GHRH-Rezeptor-Agonist (GHRHR)</li>
      <li>Kurze Halbwertszeit (~10-20 min in vivo) – häufige Dosierung in Studien</li>
      <li>Gut verträglich in Tiermodellen mit langer Forschungsgeschichte</li>
      <li>Etabliertes Werkzeug für die somatotrope-Achsen-Forschung</li>
      <li>Synergismus mit GHRP-Klasse in kombinierten Studiendesigns</li>
    </ul>
    <p>CAS-Nummer: 86168-78-7 | Reinheit: ≥98%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Ausschließlich für wissenschaftliche Forschung.</p>
    <h4>Forschungsprotokoll</h4>
    <ul>
      <li>Studiendosis: 0,2–1,0 µg/kg subkutan (Tiermodelle)</li>
      <li>Frequenz: 2–3× täglich aufgrund kurzer Halbwertszeit</li>
      <li>Optimale Studienappalikation: morgens und präschlaf</li>
      <li>Lagerung: -20°C lyophilisiert, Lösung max. 3 Tage bei 4°C</li>
    </ul>`,
    purity: '98.0%',
    format: '5mg',
    molecular: 'C149H246N44O42S',
    weight: '3358.0 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '🔬',
    gradient: 'linear-gradient(135deg, #2d1000 0%, #4a1f00 50%, #6b2d00 100%)',
    glowColor: 'rgba(255, 120, 0, 0.2)',
  },
  {
    id: 6,
    name: 'HGH Fragment 176-191',
    fullName: 'HGH Fragment 176-191 (Lipolytisches GH-Peptid)',
    category: 'fat-loss',
    categoryLabel: 'Fettabbau & Stoffwechsel',
    price: 44.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 178,
    badge: null,
    badgeType: null,
    description: 'HGH Fragment 176-191 ist ein stabilisiertes Analogon der C-terminalen Region von Wachstumshormon. In Studien zeigt es lipolytische Aktivität ohne die anabolen oder diabetogenen Eigenschaften von vollständigem GH.',
    longDescription: `<p>HGH Fragment 176-191 ist ein modifiziertes Fragment des Wachstumshormon-Polypeptids, das die Aminosäuren 176 bis 191 des C-terminalen Endes von humanem GH umfasst. Es wird als stabilisiertes Analogon hergestellt, das gegenüber der nativen Sequenz eine verbesserte Stabilität und Halbwertszeit aufweist.</p>
    <p>Das Fragment wurde entwickelt, um die lipolytischen Eigenschaften von GH zu isolieren, ohne die anabolen oder insulinresistenzfördernden Effekte. In präklinischen Studien zeigte HGH Frag 176-191 eine selektive Aktivierung des Fettstoffwechsels.</p>
    <p>Forschungsmodelle mit Nagetieren zeigten eine erhöhte Fettoxidation, insbesondere bei viszeralem Fettgewebe, bei gleichzeitiger Erhaltung der Insulinsensitivität. Dies macht es zu einem interessanten Forschungsobjekt für Stoffwechselstudien.</p>
    <p>Alle Informationen dienen ausschließlich Forschungszwecken. Das Produkt ist nicht für den menschlichen Konsum bestimmt.</p>`,
    researchInfo: `<h4>Wissenschaftlicher Hintergrund</h4>
    <p>HGH Fragment 176-191 enthält den Bereich des GH-Moleküls, der für die Regulation des Fettstoffwechsels verantwortlich ist:</p>
    <ul>
      <li>Selektive Lipolyse-Aktivierung ohne anabole GH-Effekte</li>
      <li>Keine Beeinflussung der Blutzuckerwerte in Tiermodellen</li>
      <li>Erhöhte Fettoxidationsraten in präklinischen Metabolismusstudien</li>
      <li>Besonders untersucht: Reduktion viszeraler Adipositas</li>
      <li>12× stärkere lipolytische Aktivität als natives GH in vitro</li>
    </ul>
    <p>CAS-Nummer: 221231-10-3 | Reinheit: ≥99%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Nur für Forschungszwecke. Nicht für den menschlichen Konsum.</p>
    <h4>Studienprotokoll (Tiermodelle)</h4>
    <ul>
      <li>Forschungsdosis: 250–500 µg/kg in Nagetiermodellen</li>
      <li>Applikationsroute: subkutan oder intraperitoneal</li>
      <li>Studienfrequenz: 1–2× täglich in Kurzzeit-Metabolismusstudien</li>
      <li>Lagerung: -20°C (lyophilisiert), max. 5 Tage in Lösung bei 4°C</li>
    </ul>`,
    purity: '99.0%',
    format: '5mg',
    molecular: 'C78H123N23O23S2',
    weight: '1817.1 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '🔥',
    gradient: 'linear-gradient(135deg, #2d0010 0%, #500020 50%, #700035 100%)',
    glowColor: 'rgba(255, 50, 100, 0.2)',
  },
  {
    id: 7,
    name: 'Melanotan II',
    fullName: 'Melanotan II (MT-II, α-MSH Analogon)',
    category: 'research',
    categoryLabel: 'Forschungspeptide',
    price: 49.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 112,
    badge: 'Neu',
    badgeType: 'new',
    description: 'Melanotan II ist ein zyklisches Peptid und potenter Agonist der Melanocortin-Rezeptoren. In Forschungsstudien zeigt es Effekte auf Pigmentierung, Appetit und weitere melanocortinvermittelte Prozesse.',
    longDescription: `<p>Melanotan II ist ein synthetisches zyklisches Analogon des Alpha-Melanozyten-stimulierenden Hormons (α-MSH). Als potenter, nicht-selektiver Melanocortin-Rezeptor-Agonist (MC1R-MC4R) ist es ein wichtiges Werkzeug in der Melanocortin-Systemforschung.</p>
    <p>Die Forschung mit MT-II hat wesentlich zum Verständnis des Melanocortin-Systems beigetragen, das eine Rolle bei der Regulation von Pigmentierung, Energie-Homöostase, sexueller Funktion und Entzündung spielt.</p>
    <p>Präklinische Studien mit MT-II haben wichtige Einblicke in die MC1R-vermittelte Melanogenese und MC4R-vermittelte Appetit- und Gewichtsregulation geliefert. Diese Erkenntnisse haben zur Entwicklung selektiverer therapeutischer Kandidaten geführt.</p>
    <p>Alle Informationen dienen rein wissenschaftlichen Zwecken. Melanotan II ist kein zugelassenes Arzneimittel.</p>`,
    researchInfo: `<h4>Forschungsrelevanz</h4>
    <p>MT-II ist ein etabliertes Werkzeug in der Melanocortin-Systemforschung:</p>
    <ul>
      <li>Nicht-selektiver MC1R-MC4R Agonist</li>
      <li>Forschungsschwerpunkt: Melanogenese und Photoprotektionsmechanismen</li>
      <li>Appetit- und Gewichtsregulation über MC4R-Achse</li>
      <li>Sexualverhalten-Studien (MC3R/MC4R in Tiermodellen)</li>
      <li>Grundlagenforschung zum Melanocortin-System</li>
    </ul>
    <p>CAS-Nummer: 121062-08-6 | Reinheit: ≥98%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Nur für lizenzierte Forschungslabors. Nicht für den menschlichen Konsum.</p>
    <h4>Forschungsprotokoll (Tiermodelle)</h4>
    <ul>
      <li>Studiendosis: 0,025–0,5 mg/kg in Nagetiermodellen</li>
      <li>Applikationsroute: subkutan oder intraperitoneal</li>
      <li>Melanogenese-Studien: lokale dermale Applikation möglich</li>
      <li>Lagerung: -20°C; lichtgeschützt; Lösungsstabilität 48h bei 4°C</li>
    </ul>`,
    purity: '98.0%',
    format: '10mg',
    molecular: 'C50H69N15O9',
    weight: '1024.2 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '☀️',
    gradient: 'linear-gradient(135deg, #2d2000 0%, #4a3800 50%, #6b5200 100%)',
    glowColor: 'rgba(255, 200, 0, 0.2)',
  },
  {
    id: 8,
    name: 'PT-141',
    fullName: 'PT-141 (Bremelanotid, MC4R-Agonist)',
    category: 'research',
    categoryLabel: 'Forschungspeptide',
    price: 54.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 98,
    badge: null,
    badgeType: null,
    description: 'PT-141 (Bremelanotid) ist ein zyklisches Peptid und selektiver MC3R/MC4R-Agonist. Es wurde aus Melanotan II entwickelt und ist ein wichtiges Forschungsobjekt für das melanocortinvermittelte Nervensystem.',
    longDescription: `<p>PT-141, chemisch bekannt als Bremelanotid, ist ein zyklisches Heptapeptid, das durch die Metabolisierung von Melanotan II entdeckt wurde. Im Gegensatz zu MT-II fehlt PT-141 die acetylierende N-terminale Gruppe, was zu einem unterschiedlichen Rezeptor-Bindungsprofil führt.</p>
    <p>Als selektiverer MC3R/MC4R-Agonist ist PT-141 ein wertvolles Forschungswerkzeug zur Untersuchung des zentralen Melanocortin-Systems. Die Forschung hat gezeigt, dass es ohne den vaskulären Mechanismus von PDE5-Hemmern wirkt.</p>
    <p>Präklinische und klinische Forschungen (bis Phase-III) haben wichtige Erkenntnisse über die Rolle des melanocortinergen Systems in der Regulation sexueller Funktionen geliefert. Diese Daten sind für die Neuropharmakologie bedeutsam.</p>
    <p>Alle Informationen sind ausschließlich für Forschungszwecke. PT-141 ist in Deutschland nicht als Arzneimittel zugelassen.</p>`,
    researchInfo: `<h4>Pharmakologisches Profil</h4>
    <p>PT-141 zeigt im Vergleich zu Melanotan II ein verfeinertes pharmakologisches Profil:</p>
    <ul>
      <li>Selektivere MC3R/MC4R Agonistik vs. MT-II</li>
      <li>Zentralnervöse Wirkung über melanocortinerges System</li>
      <li>Gut charakterisiert in präklinischen und klinischen Studien</li>
      <li>Forschungsschwerpunkt: sexuelle Dysfunktion-Mechanismen</li>
      <li>Neutrale Auswirkung auf Melanin-Pigmentierung</li>
    </ul>
    <p>CAS-Nummer: 189691-06-3 | Reinheit: ≥98%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Nur für lizenzierte Forschungslabors. Nicht für den menschlichen Konsum.</p>
    <h4>Studienprotokoll</h4>
    <ul>
      <li>Präklinische Dosis: 1–10 µg/kg subkutan (Nagetiermodelle)</li>
      <li>Applikationsroute in Studien: subkutan oder intranasal</li>
      <li>Studiendesign: akute Einzeldosis-Studien</li>
      <li>Lagerung: -20°C lyophilisiert; Lösungsstabilität 48h bei 4°C</li>
    </ul>`,
    purity: '98.5%',
    format: '10mg',
    molecular: 'C49H64N14O8',
    weight: '1025.1 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '🧪',
    gradient: 'linear-gradient(135deg, #2d0022 0%, #4a0038 50%, #650055 100%)',
    glowColor: 'rgba(220, 50, 200, 0.2)',
  },
  {
    id: 9,
    name: 'GHRP-2',
    fullName: 'GHRP-2 (Growth Hormone Releasing Peptide 2)',
    category: 'growth',
    categoryLabel: 'Wachstum & GH-Achse',
    price: 34.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 267,
    badge: 'Bestseller',
    badgeType: 'bestseller',
    description: 'GHRP-2 ist ein synthetisches hexapeptidisches Wachstumshormon-Sekretagog der zweiten Generation. In Forschungsstudien stimuliert es die GH-Freisetzung deutlich stärker als GHRP-6 mit geringerem appetit-stimulierenden Effekt.',
    longDescription: `<p>GHRP-2 (D-Ala-D-beta-Nal-Ala-Trp-D-Phe-Lys-NH2) ist ein synthetisches, hexapeptidisches Analogon der zweiten Generation von GHRP-6. Es ist ein potenter Agonist des Ghrelin-Rezeptors (GHSR-1a) und bewirkt eine starke pulsatile GH-Freisetzung in Forschungsmodellen.</p>
    <p>Im Vergleich zu GHRP-6 zeigt GHRP-2 in Studien eine stärkere GH-stimulierende Wirkung bei gleichzeitig geringeren appetit-stimulierenden Effekten. Dies ist auf eine unterschiedliche Bindungscharakteristik am Ghrelin-Rezeptor zurückzuführen.</p>
    <p>GHRP-2 bewirkt in Tiermodellen auch eine Stimulation von Cortisol und Prolaktin, wenngleich in geringerem Maß als die Wachstumshormonsekretion. Dies unterscheidet es von selektiveren Verbindungen wie Ipamorelin.</p>
    <p>Alle Informationen dienen ausschließlich Forschungszwecken.</p>`,
    researchInfo: `<h4>Vergleichende GHRP-Forschung</h4>
    <p>GHRP-2 ist in der GH-Sekretions-Forschung gut charakterisiert:</p>
    <ul>
      <li>Potenter GHSR-1a Agonist – stärkste GH-Stimulation der GHRP-Klasse</li>
      <li>Geringer appetit-stimulierender Effekt vs. GHRP-6</li>
      <li>Mäßige Cortisol/Prolaktin-Stimulation in Tiermodellen</li>
      <li>Synergistisch mit GHRH/CJC-1295 in Kombinations-Studien</li>
      <li>Halbwertszeit: ~30 Minuten in Tiermodellen</li>
    </ul>
    <p>CAS-Nummer: 158861-67-7 | Reinheit: ≥99%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Nur für Forschungszwecke. Nicht für den menschlichen Konsum.</p>
    <h4>Studienprotokoll (Tiermodelle)</h4>
    <ul>
      <li>Forschungsdosis: 100–300 µg/kg in Nagetiermodellen</li>
      <li>Applikationsroute: subkutan oder intravenös</li>
      <li>Studienfrequenz: 2–3× täglich in Langzeitstudien</li>
      <li>Synergistisch mit GHRH-Analoga in kombinierten Studiendesigns</li>
    </ul>`,
    purity: '99.0%',
    format: '5mg',
    molecular: 'C45H55N9O6',
    weight: '817.9 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '💊',
    gradient: 'linear-gradient(135deg, #001a2d 0%, #003055 50%, #004880 100%)',
    glowColor: 'rgba(0, 150, 255, 0.25)',
  },
  {
    id: 10,
    name: 'GHRP-6',
    fullName: 'GHRP-6 (Growth Hormone Releasing Peptide 6)',
    category: 'growth',
    categoryLabel: 'Wachstum & GH-Achse',
    price: 34.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 198,
    badge: null,
    badgeType: null,
    description: 'GHRP-6 ist das Ursprungs-Wachstumshormon-Sekretagog-Hexapeptid und das am besten erforschte der GHRP-Klasse. In Studien stimuliert es GH-Freisetzung und ist das Referenzmolekül für Ghrelin-Rezeptor-Forschung.',
    longDescription: `<p>GHRP-6 (His-D-Trp-Ala-Trp-D-Phe-Lys-NH2) ist das erste synthetische Wachstumshormon-Sekretagog-Hexapeptid, das entwickelt wurde. Als historisches Referenzmolekül der GHRP-Klasse hat es die Entdeckung des Ghrelin-Rezeptors (GHSR) maßgeblich vorangetrieben.</p>
    <p>GHRP-6 bewirkt in Forschungsmodellen eine robuste, dosisabhängige GH-Freisetzung über den Ghrelin-Rezeptor. Charakteristisch ist der ausgeprägte appetit-stimulierende Effekt, der durch den gleichen Rezeptormechanismus vermittelt wird wie beim endogenen Ghrelin.</p>
    <p>Als gut charakterisiertes Referenzmolekül wird GHRP-6 häufig als Standard in Vergleichsstudien mit neueren Sekretagogen eingesetzt. Es hat erheblich zum Verständnis der GH-Achse beigetragen.</p>
    <p>Alle Informationen sind ausschließlich für Forschungszwecke. Kein Arzneimittel.</p>`,
    researchInfo: `<h4>Historische Bedeutung & Forschung</h4>
    <p>GHRP-6 ist das Referenzmolekül der GHRP-Klasse:</p>
    <ul>
      <li>Erstes synthetisches GHRP – Referenz für Ghrelin-Rezeptor-Forschung</li>
      <li>Robuste GH-Freisetzung in Tier- und Humanmodellen</li>
      <li>Stark appetit-stimulierend über GHSR-1a (ähnlich Ghrelin)</li>
      <li>Umfangreiche Literatur: >500 Publikationen</li>
      <li>Verhältnis GH/Cortisol-Stimulation: niedriger als bei GHRP-2</li>
    </ul>
    <p>CAS-Nummer: 87616-84-0 | Reinheit: ≥98%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Nur für Forschungszwecke. Nicht für den menschlichen Konsum.</p>
    <h4>Studienprotokoll (Nagetiermodelle)</h4>
    <ul>
      <li>Standarddosis: 100–400 µg/kg in Nagetiermodellen</li>
      <li>Applikationsroute: subkutan, intravenös oder intranasal</li>
      <li>Studienfrequenz: 1–3× täglich</li>
      <li>Lagerung: -20°C lyophilisiert; Lösungsstabilität 48h bei 4°C</li>
    </ul>`,
    purity: '98.0%',
    format: '5mg',
    molecular: 'C46H56N12O6',
    weight: '873.0 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '🌀',
    gradient: 'linear-gradient(135deg, #002d1a 0%, #004d2a 50%, #006b3a 100%)',
    glowColor: 'rgba(0, 200, 100, 0.2)',
  },
  {
    id: 11,
    name: 'Epithalon',
    fullName: 'Epithalon (Epitalon, Tetrapeptid)',
    category: 'anti-aging',
    categoryLabel: 'Anti-Aging & Longevity',
    price: 64.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 134,
    badge: 'Neu',
    badgeType: 'new',
    description: 'Epithalon ist ein synthetisches Tetrapeptid (Ala-Glu-Asp-Gly), das in der Zirbeldrüsenforschung entwickelt wurde. Es ist eines der meistdiskutierten Peptide in der Longevity-Forschung aufgrund seiner Auswirkungen auf Telomerase.',
    longDescription: `<p>Epithalon (auch bekannt als Epitalon oder Epitalone) ist ein synthetisches Tetrapeptid bestehend aus vier Aminosäuren: Ala-Glu-Asp-Gly. Es wurde von der russischen Wissenschaft, insbesondere von Professor Vladimir Khavinson und dem St. Petersburg Institute of Bioregulation and Gerontology entwickelt.</p>
    <p>Das Peptid hat in der Longevity-Forschung erhebliche Aufmerksamkeit erregt, da Studien an Zellkulturen und Tiermodellen Effekte auf die Telomerase-Aktivität gezeigt haben. Telomerase ist das Enzym, das die Telomerlänge – einen wichtigen Biomarker des Zellalterns – reguliert.</p>
    <p>Zusätzliche Forschungsgebiete umfassen die Regulation des zirkadianen Rhythmus und der Melatonin-Produktion, neuroprotektive Eigenschaften sowie Auswirkungen auf die Immunfunktion in Altersmodellen.</p>
    <p>Alle Informationen sind ausschließlich für Forschungszwecke. Epithalon ist kein zugelassenes Arzneimittel in der EU.</p>`,
    researchInfo: `<h4>Longevity-Forschung & Telomerase</h4>
    <p>Epithalon ist das führende Forschungspeptid im Longevity-Bereich:</p>
    <ul>
      <li>Telomerase-Aktivierung in humanen Zellkulturen (in vitro)</li>
      <li>Verlängerte Lebensspanne in Drosophila- und Mauskohorten</li>
      <li>Regulation der zirkadianen Melatonin-Produktion</li>
      <li>Immunomodulatorische Eigenschaften in Altersmodellen</li>
      <li>Forschungsbasis: >100 Studien (hauptsächlich russischsprachig)</li>
    </ul>
    <p>CAS-Nummer: 307297-39-8 | Reinheit: ≥99%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Nur für Forschungszwecke. Nicht für den menschlichen Konsum.</p>
    <h4>Studienprotokoll (Tiermodelle)</h4>
    <ul>
      <li>Studiendosis: 0,1–1,0 mg/kg in Nagetiermodellen</li>
      <li>Applikationsroute: subkutan oder intraperitoneal</li>
      <li>Langzeitstudien: typischerweise 10 Tage Zyklen mit Pause</li>
      <li>Lagerung: -20°C lyophilisiert; stabil nach Rekonstituierung 7 Tage</li>
    </ul>`,
    purity: '99.0%',
    format: '10mg',
    molecular: 'C14H22N4O9',
    weight: '390.3 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '✨',
    gradient: 'linear-gradient(135deg, #1a0540 0%, #2d0a70 50%, #40108a 100%)',
    glowColor: 'rgba(160, 80, 255, 0.25)',
  },
  {
    id: 12,
    name: 'Selank',
    fullName: 'Selank (Tuftsin-Analogon, 7-Mer)',
    category: 'cognitive',
    categoryLabel: 'Kognition & Neuropeptide',
    price: 44.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 89,
    badge: null,
    badgeType: null,
    description: 'Selank ist ein synthetisches Heptapeptid und Tuftsin-Analogon, entwickelt am Moskauer Institut für Molekulargenetik. In Forschungsstudien zeigt es anxiolytische und nootropische Eigenschaften über GABAerge und BDNF-Mechanismen.',
    longDescription: `<p>Selank ist ein synthetisches Heptapeptid (Thr-Lys-Pro-Arg-Pro-Gly-Pro), das am Institut für Molekulargenetik der Russischen Akademie der Wissenschaften entwickelt wurde. Es basiert auf dem tetrapeptidischen Immunmodulator Tuftsin (Thr-Lys-Pro-Arg) mit zusätzlicher Stabilisierungssequenz.</p>
    <p>In präklinischen Studien hat Selank bemerkenswertes Potenzial als anxiolytisches Peptid ohne sedierende Eigenschaften gezeigt. Forschungen deuten auf Modulationseffekte des GABAergen Systems hin, ähnlich Benzodiazepinen, jedoch mit anderen Bindungsstellen.</p>
    <p>Besonders interessant für die Neurobiologie sind die Forschungsdaten zu Selank's Einfluss auf BDNF (Brain-Derived Neurotrophic Factor) – einem wichtigen Wachstumsfaktor für Neuronen. Studien zeigen potenzielle neuroprotektive Effekte und Verbesserungen der kognitiven Funktion in Tiermodellen.</p>
    <p>Alle Informationen dienen ausschließlich Forschungszwecken. Selank ist kein zugelassenes Arzneimittel in der EU.</p>`,
    researchInfo: `<h4>Neuropeptid-Forschung</h4>
    <p>Selank ist ein wichtiges Forschungsobjekt in der Neuropeptidologie:</p>
    <ul>
      <li>Anxiolytische Eigenschaften ohne Sedierung in Tiermodellen</li>
      <li>GABAerge Modulation – Verstärkung der GABA-A-Inhibition</li>
      <li>BDNF-Hochregulation in präfrontalem Kortex (Nagetiere)</li>
      <li>Verbesserter Lernerfolg in Angst- und Gedächtnismodellen</li>
      <li>Immunmodulatorische Wirkungen (IL-6, Interferon)</li>
    </ul>
    <p>CAS-Nummer: 129954-34-3 | Reinheit: ≥98%</p>`,
    dosageInfo: `<p><strong>⚠️ WICHTIGER HINWEIS:</strong> Nur für Forschungszwecke. Nicht für den menschlichen Konsum.</p>
    <h4>Studienprotokoll (Nagetiermodelle)</h4>
    <ul>
      <li>Studiendosis: 100–300 µg/kg in Nagetiermodellen</li>
      <li>Applikationsroute: subkutan oder intranasal</li>
      <li>Kognitive Studien: Morris Water Maze, Open Field Tests</li>
      <li>Lagerung: -20°C lyophilisiert; Lösung max. 72h bei 4°C</li>
    </ul>`,
    purity: '98.5%',
    format: '5mg',
    molecular: 'C33H57N11O9',
    weight: '751.9 g/mol',
    storage: '-20°C',
    inStock: true,
    emoji: '🧠',
    gradient: 'linear-gradient(135deg, #002d35 0%, #004d5a 50%, #006b7a 100%)',
    glowColor: 'rgba(0, 180, 210, 0.2)',
  },
];
