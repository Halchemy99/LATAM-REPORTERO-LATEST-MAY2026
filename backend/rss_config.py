"""
RSS Feed Configuration for LATAM Reportero

This module contains the list of reputable news sources for automated
content ingestion, covering International, European, and LATAM outlets.
"""

RSS_FEEDS = {
    # ============================================
    # INTERNATIONAL OUTLETS
    # ============================================
    "reuters": {
        "name": "Reuters",
        "url": "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
        "language": "en",
        "region": "international",
        "category": "general"
    },
    "ap_news": {
        "name": "Associated Press",
        "url": "https://rsshub.app/apnews/topics/apf-topnews",
        "language": "en",
        "region": "international",
        "category": "general"
    },
    "nytimes_world": {
        "name": "New York Times - World",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
        "language": "en",
        "region": "international",
        "category": "general"
    },
    "nytimes_americas": {
        "name": "New York Times - Americas",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml",
        "language": "en",
        "region": "latam",
        "category": "general"
    },
    "guardian_world": {
        "name": "The Guardian - World",
        "url": "https://www.theguardian.com/world/rss",
        "language": "en",
        "region": "international",
        "category": "general"
    },
    "guardian_americas": {
        "name": "The Guardian - Americas",
        "url": "https://www.theguardian.com/world/americas/rss",
        "language": "en",
        "region": "latam",
        "category": "general"
    },
    
    # ============================================
    # EUROPEAN OUTLETS
    # ============================================
    "bbc_world": {
        "name": "BBC News - World",
        "url": "http://feeds.bbci.co.uk/news/world/rss.xml",
        "language": "en",
        "region": "international",
        "category": "general"
    },
    "dw_english": {
        "name": "Deutsche Welle - English",
        "url": "https://rss.dw.com/rdf/rss-en-all",
        "language": "en",
        "region": "europe",
        "category": "general"
    },
    "el_pais_spain": {
        "name": "El País (Spain)",
        "url": "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada",
        "language": "es",
        "region": "europe",
        "category": "general"
    },
    
    # ============================================
    # LATAM - MEXICO
    # ============================================
    "el_universal_mx": {
        "name": "El Universal (Mexico)",
        "url": "https://www.eluniversal.com.mx/rss.xml",
        "language": "es",
        "region": "mexico",
        "category": "general"
    },
    "la_jornada": {
        "name": "La Jornada (Mexico)",
        "url": "https://www.jornada.com.mx/rss/edicion.xml",
        "language": "es",
        "region": "mexico",
        "category": "general"
    },
    
    # ============================================
    # LATAM - BRAZIL
    # ============================================
    "folha_sp": {
        "name": "Folha de S.Paulo (Brazil)",
        "url": "https://feeds.folha.uol.com.br/mundo/rss091.xml",
        "language": "pt",
        "region": "brazil",
        "category": "general"
    },
    "o_globo": {
        "name": "O Globo (Brazil)",
        "url": "https://oglobo.globo.com/rss/oglobo",
        "language": "pt",
        "region": "brazil",
        "category": "general"
    },
    
    # ============================================
    # LATAM - ARGENTINA
    # ============================================
    "la_nacion_ar": {
        "name": "La Nación (Argentina)",
        "url": "https://www.lanacion.com.ar/arc/outboundfeeds/rss/",
        "language": "es",
        "region": "argentina",
        "category": "general"
    },
    "infobae": {
        "name": "Infobae (Argentina/LATAM)",
        "url": "https://www.infobae.com/arc/outboundfeeds/rss/",
        "language": "es",
        "region": "argentina",
        "category": "general"
    },
    
    # ============================================
    # LATAM - COLOMBIA
    # ============================================
    "el_tiempo_co": {
        "name": "El Tiempo (Colombia)",
        "url": "https://www.eltiempo.com/rss/headlines.xml",
        "language": "es",
        "region": "colombia",
        "category": "general"
    },
    "el_espectador": {
        "name": "El Espectador (Colombia)",
        "url": "https://www.elespectador.com/arc/outboundfeeds/rss/",
        "language": "es",
        "region": "colombia",
        "category": "general"
    },
    
    # ============================================
    # LATAM - CHILE
    # ============================================
    "el_mercurio_cl": {
        "name": "El Mercurio (Chile)",
        "url": "https://www.emol.com/rss/rss.asp",
        "language": "es",
        "region": "chile",
        "category": "general"
    },
    "la_tercera": {
        "name": "La Tercera (Chile)",
        "url": "https://www.latercera.com/arc/outboundfeeds/rss/",
        "language": "es",
        "region": "chile",
        "category": "general"
    },
    
    # ============================================
    # LATAM - PERU
    # ============================================
    "el_comercio_pe": {
        "name": "El Comercio (Peru)",
        "url": "https://elcomercio.pe/arcio/rss/",
        "language": "es",
        "region": "peru",
        "category": "general"
    },
    
    # ============================================
    # REGIONAL SPANISH
    # ============================================
    "bbc_mundo": {
        "name": "BBC Mundo",
        "url": "https://feeds.bbci.co.uk/mundo/rss.xml",
        "language": "es",
        "region": "latam",
        "category": "general"
    },
    "dw_espanol": {
        "name": "Deutsche Welle - Español",
        "url": "https://rss.dw.com/rdf/rss-sp-all",
        "language": "es",
        "region": "latam",
        "category": "general"
    },
}

# Categories for solutions journalism classification
SOLUTIONS_CATEGORIES = [
    "environment",
    "economy", 
    "health",
    "education",
    "politics",
    "technology",
    "human-rights",
    "infrastructure",
    "agriculture",
    "energy"
]

# Regions for geographic tagging
LATAM_REGIONS = [
    "mexico",
    "brazil", 
    "argentina",
    "colombia",
    "chile",
    "peru",
    "venezuela",
    "ecuador",
    "bolivia",
    "central-america",
    "caribbean",
    "latam",  # General LATAM
    "international",
    "europe"
]
