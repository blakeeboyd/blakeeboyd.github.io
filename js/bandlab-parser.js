// State variables
let jsonOutput = null;
let metadata = {
    name: '',
    artist: '',
    genre: '',
    instruments: '',
    image: '',
    description: '',
    url: '',
};

// Regex patterns
const BPM_REGEX = /\b(\d{2,3})(\s?bpm)?\b/i;
const KEY_REGEX = /\b([A-G][#b]?)\s?(maj|min|m|M|major|minor|dim|aug)\b/i;
const TYPE_REGEX = /\b(loop|one-shot|single|hit|wav|stem|full mix)\b/i;
const DURATION_REGEX = /\b\d{1,2}:\d{2}\b/;
const BARS_REGEX = /\b\d+\s?bars\b/i;

const INSTRUMENT_KEYWORDS = [
    'kick', 'snare', 'hat', 'clap', 'perc', 'bass', 'synth', 'keys', 'piano', 'guitar',
    'fx', 'drum', 'vocal', 'voice', 'pad', 'lead', 'tom', 'cymbal', 'riser', 'atmosphere',
    'foley', 'impact', 'sweep', 'glitch', 'noise', 'sub', 'texture', 'ambience', 'drone', 'shaker'
];

const CHARACTER_KEYWORDS = [
    'dry', 'wet', 'clean', 'dirty', 'processed', 'acoustic', 'electronic', 'lo-fi', 'vintage',
    'dark', 'bright', 'hard', 'soft', 'upbeat', 'downbeat', 'aggressive', 'calm', 'quirky',
    'heavy', 'melodic', 'percussive', 'cinematic', 'experimental', 'ethereal'
];

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadText = document.getElementById('uploadText');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const debugInfo = document.getElementById('debugInfo');
const metadataSection = document.getElementById('metadataSection');
const jsonOutputContainer = document.getElementById('jsonOutputContainer');
const placeholderContainer = document.getElementById('placeholderContainer');
const jsonOutputElement = document.getElementById('jsonOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Metadata inputs
const metaName = document.getElementById('metaName');
const metaArtist = document.getElementById('metaArtist');
const metaGenre = document.getElementById('metaGenre');
const metaInstruments = document.getElementById('metaInstruments');
const metaImage = document.getElementById('metaImage');
const metaUrl = document.getElementById('metaUrl');
const metaDescription = document.getElementById('metaDescription');

// Event listeners
fileInput.addEventListener('change', handleFileUpload);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadJson);

// Metadata input listeners
metaName.addEventListener('input', () => handleMetadataChange('name', metaName.value));
metaArtist.addEventListener('input', () => handleMetadataChange('artist', metaArtist.value));
metaGenre.addEventListener('input', () => handleMetadataChange('genre', metaGenre.value));
metaInstruments.addEventListener('input', () => handleMetadataChange('instruments', metaInstruments.value));
metaImage.addEventListener('input', () => handleMetadataChange('image', metaImage.value));
metaUrl.addEventListener('input', () => handleMetadataChange('url', metaUrl.value));
metaDescription.addEventListener('input', () => handleMetadataChange('description', metaDescription.value));

// Check for bookmarklet data on page load
window.addEventListener('DOMContentLoaded', checkForBookmarkletData);

// Accept large packs delivered via postMessage (URL hash can't carry >~800 KB).
window.addEventListener('message', function (e) {
    if (e.origin !== 'https://www.bandlab.com') return;      // only trust BandLab tabs
    if (!e.data || e.data.type !== 'bandlab-pack') return;
    if (e.source) e.source.postMessage({ type: 'parser-ack' }, e.origin);  // stop the retries
    parseHTML(e.data.html, e.data.title, true);              // same call the hash path makes
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    uploadText.textContent = file.name;
    hideError();
    hideDebugInfo();

    const reader = new FileReader();
    reader.onload = (e) => {
        // Check if auto-download is enabled
        const autoDownloadCheckbox = document.getElementById('autoDownloadCheckbox');
        const autoDownload = autoDownloadCheckbox ? autoDownloadCheckbox.checked : false;
        parseHTML(e.target.result, file.name, autoDownload);
    };
    reader.readAsText(file);
}

function parseHTML(htmlContent, filename, autoDownload = false) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        const extractedMeta = extractMetadata(doc, htmlContent);
        metadata = extractedMeta;
        updateMetadataInputs();

        let samples = [];
        let strategyUsed = "";

        const bandLabSamples = parseBandLabSamples(doc, extractedMeta);

        if (bandLabSamples.length > 0) {
            samples = bandLabSamples;
            strategyUsed = "BandLab Specific Layout";
        } else {
            const tableSamples = parseTable(doc, extractedMeta);
            if (tableSamples.length > 0) {
                samples = tableSamples;
                strategyUsed = "Table Parsing";
            } else {
                const listSamples = parseRepeatedStructures(doc, extractedMeta);
                if (listSamples.length > 0) {
                    samples = listSamples;
                    strategyUsed = "Pattern Recognition";
                }
            }
        }

        if (samples.length === 0) {
            throw new Error("Could not detect sample data. Please ensure the HTML file contains the loaded list of samples.");
        }

        // Generate identifier based on pack name for BandLab packs, or use filename for others
        let id;
        if (strategyUsed === "BandLab Specific Layout" && extractedMeta.name && extractedMeta.name !== "Unknown Pack") {
            id = generateBandLabIdentifier(extractedMeta.name);
        } else {
            // For non-BandLab files or if pack name couldn't be extracted, use filename
            id = filename.replace(/\.[^/.]+$/, "");
        }

        const finalData = processSamples(id, extractedMeta, samples);
        jsonOutput = finalData;

        showDebugInfo(`Parsed using: ${strategyUsed}. Found ${samples.length} raw items.`);
        displayJson();
        metadataSection.classList.remove('hidden');

        // Auto-download if triggered from bookmarklet
        if (autoDownload) {
            // Use setTimeout to ensure the UI updates before download
            setTimeout(() => {
                downloadJson();
            }, 100);
        }

    } catch (err) {
        showError(err.message);
    }
}

function extractMetadata(doc, htmlRaw) {
    let rawName = "Unknown Pack";
    const specificNameEl = doc.querySelector('.sounds-pack-header-title');
    if (specificNameEl) {
        rawName = specificNameEl.textContent.trim();
    } else {
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.content;
        const docTitle = doc.querySelector('title')?.textContent || "";
        const h1Text = doc.querySelector('h1')?.textContent || "";
        rawName = ogTitle || h1Text.trim() || docTitle;
    }
    let name = rawName.split('|')[0].trim();

    let artist = "Unknown Artist";
    const specificArtistEl = doc.querySelector('.sounds-user-tile-title.text-truncate a.text-truncate');
    const authorLink = doc.querySelector('a[href^="/users/"]');
    const creatorEl = doc.querySelector('[class*="creator"], [class*="artist"]');

    let rawArtist = specificArtistEl ? specificArtistEl.textContent : (authorLink ? authorLink.textContent : (creatorEl ? creatorEl.textContent : ""));

    if (rawArtist) {
        let clean = rawArtist.split(/[•|·]/)[0];
        clean = clean.replace(/Follow.*$/i, "");
        artist = clean.trim();
    } else {
        const desc = doc.querySelector('meta[name="description"]')?.content || "";
        if (desc.includes(" by ")) {
            const parts = desc.split(" by ");
            if (parts.length > 1) artist = parts[1].split(/[.,|]/)[0].trim();
        }
    }

    if (artist === "Unknown Artist" || !artist) {
        artist = "BandLab";
    }

    let image = "";
    const ogImage = doc.querySelector('meta[property="og:image"]')?.content;
    const coverImg = doc.querySelector('.sounds-pack-cover img')?.src;
    image = ogImage || coverImg || "";

    let description = "";
    const metaDesc = doc.querySelector('meta[name="description"]')?.content;
    const divDesc = doc.querySelector('.sounds-pack-header-description')?.textContent;
    description = (divDesc || metaDesc || "").trim();

    let url = "";
    const ogUrl = doc.querySelector('meta[property="og:url"]')?.content;
    const canonical = doc.querySelector('link[rel="canonical"]')?.href;

    if (ogUrl) {
        url = ogUrl;
    } else if (canonical) {
        url = canonical;
    } else {
        const savedFromMatch = htmlRaw.match(/saved from url=\(\d+\)(https?:\/\/[^\s>]+)/);
        if (savedFromMatch) {
            url = savedFromMatch[1];
        }
    }

    let genre = "Unknown Genre";
    let instruments = "";
    let defaultType = null;

    const metaSpans = Array.from(doc.querySelectorAll('.sounds-pack-header-meta span'));

    if (metaSpans.length === 3) {
        const typeText = metaSpans[0].textContent.trim().toLowerCase();
        if (typeText.includes("one-shot")) defaultType = "One-Shot";
        else if (typeText.includes("loop")) defaultType = "Loop";

        genre = metaSpans[1].textContent.trim();
        instruments = metaSpans[2].textContent.trim();

    } else if (metaSpans.length === 4) {
        defaultType = null;
        genre = metaSpans[2].textContent.trim();
        instruments = metaSpans[3].textContent.trim();
    } else {
        const bodyText = doc.body.innerText;
        const summaryRegex = /(\d+)\s+(One-Shots|Loops|Samples)[,.]\s+([^.\n]+)/i;
        const summaryMatch = bodyText.match(summaryRegex);

        if (summaryMatch) {
            if (!defaultType) {
                if (summaryMatch[2].toLowerCase().includes("loop")) defaultType = "Loop";
                if (summaryMatch[2].toLowerCase().includes("shot")) defaultType = "One-Shot";
            }
            if (genre === "Unknown Genre") {
                genre = summaryMatch[3].trim();
            }
        }
    }

    if (genre === "Unknown Genre") {
        const genreEl = doc.querySelector('[class*="genre"], [class*="tag"]');
        if (genreEl) genre = genreEl.textContent.trim();
    }

    genre = cleanGenre(genre);

    return { name, artist, genre, instruments, defaultType, image, description, url };
}

function cleanGenre(rawGenre) {
    if (!rawGenre) return "Unknown Genre";
    let processed = rawGenre;

    const compounds = ["Foley & Sound Effects", "Drum & Bass", "Rhythm & Blues", "Rock & Roll", "Hip Hop & Rap"];
    compounds.forEach((c) => {
        const regex = new RegExp(c, "gi");
        processed = processed.replace(regex, (match) => match.replace("&", "%%%"));
    });

    processed = processed.replace(/\s+&\s+/g, ", ");
    processed = processed.replace(/%%%/g, "&");

    return processed;
}

function parseBandLabSamples(doc, meta) {
    const rows = Array.from(doc.querySelectorAll('.sounds-loop'));

    if (rows.length === 0) return [];

    return rows.map(row => {
        const rowText = row.innerText || "";
        let sample = {
            Name: "Untitled",
            Type: "Unknown",
            Character: ["General"],
            Instrument: "Unknown",
            Genre: [],
            BPM: null,
            Key: null,
            Length: null
        };

        const nameEl = row.querySelector('.sounds-loop-name .sounds-loop-name-container .text-truncate');
        if (nameEl) {
            sample.Name = nameEl.textContent.trim();
        } else {
            sample.Name = "Untitled Sample";
        }

        const typeEl = row.querySelector('.sounds-tooltip-center span');
        if (typeEl) {
            const typeText = typeEl.textContent.trim().toLowerCase();
            if (typeText.includes('loop')) {
                sample.Type = "Loop";
            } else if (typeText.includes('one-shot') || typeText.includes('oneshot')) {
                sample.Type = "One-Shot";
            }
        }

        if (sample.Type === "Unknown") {
            const typeMatch = rowText.match(TYPE_REGEX);
            if (typeMatch) {
                sample.Type = typeMatch[0];
            } else if (meta.defaultType) {
                sample.Type = meta.defaultType;
            } else {
                sample.Type = "One-Shot";
            }
        }

        const lengthEl = row.querySelector('.sounds-loop-type-info');
        if (lengthEl) {
            sample.Length = lengthEl.textContent.trim();
        } else {
            const durMatch = rowText.match(DURATION_REGEX);
            const barMatch = rowText.match(BARS_REGEX);
            if (durMatch) sample.Length = durMatch[0];
            else if (barMatch) sample.Length = barMatch[0];
        }

        const charEl = row.querySelector('.sounds-loop-characters.text-truncate');
        if (charEl) {
            const charText = charEl.textContent.trim();
            if (charText) {
                sample.Character = charText.split(',').map(c => c.trim()).filter(Boolean);
            }
        } else {
            const foundChars = [];
            const lowerText = rowText.toLowerCase();
            for (let char of CHARACTER_KEYWORDS) {
                if (lowerText.includes(char)) {
                    foundChars.push(char.charAt(0).toUpperCase() + char.slice(1));
                }
            }
            if (foundChars.length > 0) sample.Character = foundChars;
        }

        const genreEl = row.querySelector('.sounds-loop-genres.text-truncate');
        if (genreEl) {
            const genreText = genreEl.textContent.trim();
            if (genreText) {
                sample.Genre = genreText.split(',').map(g => g.trim()).filter(Boolean);
            }
        }

        const bpmEl = row.querySelector('.sounds-loop-tempo.text-truncate span');
        if (bpmEl) {
            const bpmText = bpmEl.textContent.trim();
            if (bpmText && bpmText !== "-") {
                sample.BPM = bpmText;
            } else {
                sample.BPM = null;
            }
        } else {
            sample.BPM = null;
        }

        const keyEl = row.querySelector('.sounds-loop-key.text-truncate');
        if (keyEl) {
            const keyText = keyEl.textContent.trim();
            if (keyText && keyText !== "-") {
                sample.Key = keyText;
            } else {
                sample.Key = null;
            }
        } else {
            sample.Key = null;
        }

        const instEl = row.querySelector('.sounds-loop-instrument.text-truncate');
        if (instEl) {
            sample.Instrument = instEl.textContent.trim();
        } else {
            const lowerText = rowText.toLowerCase();
            for (let inst of INSTRUMENT_KEYWORDS) {
                if (lowerText.includes(inst)) {
                    sample.Instrument = inst.charAt(0).toUpperCase() + inst.slice(1);
                    break;
                }
            }
        }

        return sample;
    });
}

function parseRepeatedStructures(doc, meta) {
    const allElements = Array.from(doc.body.querySelectorAll('*'));
    const signatures = new Map();

    allElements.forEach(el => {
        if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'NOSCRIPT', 'LINK', 'META'].includes(el.tagName)) return;
        if (!el.innerText || el.innerText.trim().length < 3) return;

        const classes = Array.from(el.classList).sort().join('.');
        const signature = `${el.tagName}.${classes}`;

        if (!signatures.has(signature)) {
            signatures.set(signature, []);
        }
        signatures.get(signature).push(el);
    });

    const candidates = Array.from(signatures.entries())
        .filter(([sig, els]) => els.length >= 3);

    let bestCandidate = null;
    let maxScore = 0;

    candidates.forEach(([sig, els]) => {
        const sampleSize = Math.min(els.length, 8);
        let score = 0;
        let validItems = 0;

        for (let i = 0; i < sampleSize; i++) {
            const text = els[i].innerText;
            let itemScore = 0;
            if (DURATION_REGEX.test(text)) itemScore += 4;
            if (BPM_REGEX.test(text)) itemScore += 2;
            if (KEY_REGEX.test(text)) itemScore += 2;
            if (TYPE_REGEX.test(text)) itemScore += 1;

            if (INSTRUMENT_KEYWORDS.some(k => text.toLowerCase().includes(k))) itemScore += 1;
            if (CHARACTER_KEYWORDS.some(k => text.toLowerCase().includes(k))) itemScore += 1;

            if (itemScore > 0) {
                score += itemScore;
                validItems++;
            }
        }

        const averageScore = validItems > 0 ? (score / sampleSize) : 0;
        const totalScore = averageScore * Math.log(els.length);

        if (totalScore > maxScore) {
            maxScore = totalScore;
            bestCandidate = els;
        }
    });

    if (!bestCandidate) return [];

    return bestCandidate.map(row => {
        const text = row.innerText;
        const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);

        let sample = {
            Name: "",
            Type: "Unknown",
            Character: ["General"],
            Instrument: "Unknown",
            Genre: [],
            BPM: null,
            Key: null,
            Length: null
        };

        const bpmMatch = text.match(BPM_REGEX);
        if (bpmMatch) sample.BPM = bpmMatch[0];

        const keyMatch = text.match(KEY_REGEX);
        if (keyMatch) sample.Key = keyMatch[0];

        const durMatch = text.match(DURATION_REGEX);
        const barMatch = text.match(BARS_REGEX);
        if (durMatch) sample.Length = durMatch[0];
        else if (barMatch) sample.Length = barMatch[0];

        const typeMatch = text.match(TYPE_REGEX);
        if (typeMatch) {
            sample.Type = typeMatch[0];
        } else if (meta.defaultType) {
            sample.Type = meta.defaultType;
        } else {
            sample.Type = "One-Shot";
        }

        let foundName = false;

        for (let line of lines) {
            const lowerLine = line.toLowerCase();
            if (BPM_REGEX.test(line)) continue;
            if (KEY_REGEX.test(line)) continue;
            if (DURATION_REGEX.test(line)) continue;
            if (TYPE_REGEX.test(line)) continue;
            if (BARS_REGEX.test(line)) continue;
            if (lowerLine === "free") continue;
            if (lowerLine === "new") continue;

            const isInstrument = INSTRUMENT_KEYWORDS.some(k => lowerLine === k || lowerLine === `${k}s`);
            const isCharacter = CHARACTER_KEYWORDS.some(k => lowerLine === k);

            if (isInstrument) {
                sample.Instrument = line;
                continue;
            }
            if (isCharacter) {
                sample.Character = [line];
                continue;
            }

            if (!foundName) {
                sample.Name = line;
                foundName = true;
            }
        }

        if (sample.Instrument === "Unknown") {
            const lowerName = sample.Name.toLowerCase();
            for (let inst of INSTRUMENT_KEYWORDS) {
                if (lowerName.includes(inst)) {
                    sample.Instrument = inst.charAt(0).toUpperCase() + inst.slice(1);
                    break;
                }
            }
        }

        return sample;
    });
}

function parseTable(doc, meta) {
    const tables = Array.from(doc.querySelectorAll('table'));
    let bestTable = null;
    let maxRows = 0;

    tables.forEach(table => {
        const rowCount = table.querySelectorAll('tr').length;
        if (rowCount > maxRows) {
            maxRows = rowCount;
            bestTable = table;
        }
    });

    if (!bestTable || maxRows < 2) return [];

    const rows = Array.from(bestTable.querySelectorAll('tr'));
    const extractedSamples = [];

    rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());
        if (cells.length < 2) return;

        const rowText = row.innerText;
        let sample = {
            Name: cells[0],
            Type: "Unknown",
            Character: ["General"],
            Instrument: "Unknown",
            Genre: [],
            BPM: null,
            Key: null,
            Length: null
        };

        const bpmMatch = rowText.match(BPM_REGEX);
        if (bpmMatch) sample.BPM = bpmMatch[0];

        const keyMatch = rowText.match(KEY_REGEX);
        if (keyMatch) sample.Key = keyMatch[0];

        const durMatch = rowText.match(DURATION_REGEX);
        if (durMatch) sample.Length = durMatch[0];

        const typeMatch = rowText.match(TYPE_REGEX);
        if (typeMatch) {
            sample.Type = typeMatch[0];
        } else if (meta.defaultType) {
            sample.Type = meta.defaultType;
        } else {
            sample.Type = "One-Shot";
        }

        extractedSamples.push(sample);
    });

    return extractedSamples;
}

function processSamples(id, meta, rawSamples) {
    let loopCount = 0;
    let oneShotCount = 0;
    const uniqueCharacters = new Set();
    const instrumentSet = new Set();

    const processedSamples = rawSamples.map(s => {
        let type = "One-Shot";
        const tLower = (s.Type || "").toLowerCase();

        if (tLower.includes('loop')) {
            type = "Loop";
            loopCount++;
        } else {
            type = "One-Shot";
            oneShotCount++;
        }

        let instrument = s.Instrument;
        if (instrument && instrument !== "Unknown") {
            instrument = instrument.charAt(0).toUpperCase() + instrument.slice(1).toLowerCase();
        }
        instrumentSet.add(instrument);

        let charArray = Array.isArray(s.Character) ? s.Character : [s.Character];
        if (charArray.length > 1) {
            charArray = charArray.filter(c => c !== "General");
        }

        const normalizedChars = charArray.map(c => {
            if (!c) return "General";
            const clean = c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
            uniqueCharacters.add(clean);
            return clean;
        });

        let genreArray = Array.isArray(s.Genre) ? s.Genre : [];

        const bpmInt = s.BPM ? parseInt(String(s.BPM).replace(/\D/g, '')) : null;

        return {
            "@type": "MusicRecording",
            name: s.Name || "Untitled",
            sampleType: type.toLowerCase(),
            duration: s.Length || null,
            character: normalizedChars,
            musicalInstrument: instrument,
            genre: genreArray,
            tempo: isNaN(bpmInt) ? null : bpmInt,
            musicalKey: s.Key || null
        };
    });

    const genreArray = meta.genre
        ? meta.genre.split(',').map(g => g.trim()).filter(Boolean)
        : [];

    const instrumentArray = meta.instruments
        ? meta.instruments.split(',').map(i => i.trim()).filter(Boolean)
        : Array.from(instrumentSet);

    return {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        identifier: id,
        name: meta.name,
        byArtist: {
            "@type": "MusicGroup",
            name: meta.artist
        },
        description: meta.description,
        image: meta.image,
        url: meta.url,
        genre: genreArray,
        instruments: instrumentArray,
        characters: Array.from(uniqueCharacters),
        counts: {
            loops: loopCount,
            oneShots: oneShotCount
        },
        track: processedSamples
    };
}

function handleMetadataChange(field, value) {
    metadata[field] = value;

    if (jsonOutput) {
        let jsonValue = value;
        if (field === 'genre' || field === 'instruments') {
            jsonValue = value.split(',').map(g => g.trim()).filter(Boolean);
        }

        if (field === 'name') jsonOutput.name = value;
        if (field === 'artist') jsonOutput.byArtist = { "@type": "MusicGroup", "name": value };
        if (field === 'description') jsonOutput.description = value;
        if (field === 'image') jsonOutput.image = value;
        if (field === 'url') jsonOutput.url = value;
        if (field === 'genre') jsonOutput.genre = jsonValue;
        if (field === 'instruments') jsonOutput.instruments = jsonValue;

        displayJson();
    }
}

function updateMetadataInputs() {
    metaName.value = metadata.name;
    metaArtist.value = metadata.artist;
    metaGenre.value = metadata.genre;
    metaInstruments.value = metadata.instruments;
    metaImage.value = metadata.image;
    metaUrl.value = metadata.url;
    metaDescription.value = metadata.description;
}

function displayJson() {
    jsonOutputElement.textContent = JSON.stringify(jsonOutput, null, 2);
    document.getElementById('jsonId').textContent = `ID: ${jsonOutput.identifier}`;
    document.getElementById('jsonCount').textContent = `${jsonOutput.track.length} Tracks found`;
    document.getElementById('loopCount').textContent = jsonOutput.counts.loops;
    document.getElementById('oneShotCount').textContent = jsonOutput.counts.oneShots;

    const verificationStatus = document.getElementById('verificationStatus');
    const totalCount = jsonOutput.counts.loops + jsonOutput.counts.oneShots;
    if (totalCount === jsonOutput.track.length) {
        verificationStatus.textContent = 'Count Verified';
        verificationStatus.className = 'verified';
    } else {
        verificationStatus.textContent = 'Count Mismatch';
        verificationStatus.className = 'mismatch';
    }

    placeholderContainer.classList.add('hidden');
    jsonOutputContainer.classList.remove('hidden');
}

function copyToClipboard() {
    if (!jsonOutput) return;
    const text = JSON.stringify(jsonOutput, null, 2);
    navigator.clipboard.writeText(text).then(() => {
        if (typeof notify === 'function') {
            notify('Copied to clipboard!', 'success');
        }
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            if (typeof notify === 'function') {
                notify('Copied to clipboard!', 'success');
            }
        } catch (err) {
            if (typeof notify === 'function') {
                notify('Failed to copy to clipboard', 'error');
            }
        }
        document.body.removeChild(textarea);
    });
}

function downloadJson() {
    if (!jsonOutput) return;
    const text = JSON.stringify(jsonOutput, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${jsonOutput.identifier}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showDebugInfo(message) {
    debugInfo.textContent = message;
    debugInfo.classList.remove('hidden');
}

function hideDebugInfo() {
    debugInfo.classList.add('hidden');
}

// Handle bookmarklet data from URL hash
function checkForBookmarkletData() {
    const hash = window.location.hash;

    if (hash.startsWith('#bookmarklet=')) {
        try {
            // Extract and decode the data
            const encodedData = hash.substring('#bookmarklet='.length);
            const decodedData = decodeURIComponent(encodedData);
            const data = JSON.parse(decodedData);

            // Parse the HTML to get the pack name
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.html, 'text/html');

            // Extract pack name (same logic as in extractMetadata)
            let packName = "Unknown Pack";
            const specificNameEl = doc.querySelector('.sounds-pack-header-title');
            if (specificNameEl) {
                packName = specificNameEl.textContent.trim();
            } else {
                const ogTitle = doc.querySelector('meta[property="og:title"]')?.content;
                const docTitle = doc.querySelector('title')?.textContent || "";
                const h1Text = doc.querySelector('h1')?.textContent || "";
                packName = ogTitle || h1Text.trim() || docTitle;
            }
            packName = packName.split('|')[0].trim();

            // Generate identifier to match BandLab's .zip naming convention
            const identifier = generateBandLabIdentifier(packName);

            // Update the upload text to show we received bookmarklet data
            uploadText.textContent = `Received from bookmarklet: ${data.title || packName}`;

            // Parse the HTML with auto-download enabled
            parseHTML(data.html, identifier + '.html', true);

            // Clear the hash from the URL to keep it clean
            history.replaceState(null, null, ' ');

        } catch (err) {
            showError('Failed to process bookmarklet data: ' + err.message);
            console.error('Bookmarklet error:', err);
        }
    }
}

// Generate identifier matching BandLab's .zip file naming convention
function generateBandLabIdentifier(packName) {
    // Convert to uppercase
    let identifier = packName.toUpperCase();

    // Replace each space or special character with a single hyphen (not using + quantifier)
    // This will naturally create multiple consecutive hyphens
    // Keep alphanumeric characters and existing hyphens, replace everything else one at a time
    identifier = identifier.replace(/[^A-Z0-9-]/g, '-');

    // Remove any leading or trailing hyphens
    identifier = identifier.replace(/^-+|-+$/g, '');

    // Add -BANDLAB suffix
    identifier = identifier + '-BANDLAB';

    return identifier;
}

