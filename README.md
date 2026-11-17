# banditoburrito_newsite
TODO: -
- manca un modo per caricare le immagini in modo facile su gihtub
-  una volta messo in produzione il sito con il dominio giusto, è da rifare la parte di privacy, dato che va a pescare i video direttamente instagram e tiktok esponendo l'ip del utente verso questi servizi
-  una volta pubblicato serve anche questo:
-  Per HSTS e No-Sniff: vai nella dashboard di Cloudflare → SSL/TLS → Edge Certificates → clicca su Enable HSTS:

Attiva Enable HSTS (Strict-Transport-Security)

Max Age Header: 12 months (31536000)

Attiva Apply HSTS policy to subdomains (includeSubDomains)

Attiva No-Sniff Header (X-Content-Type-Options: nosniff)

Per X-Frame-Options e Referrer-Policy: vai su Rules → Transform Rules → Modify Response Header → Create rule:

When incoming requests match: All incoming requests

Then:

Set static → Header name: X-Frame-Options → Value: DENY

Set static → Header name: Referrer-Policy → Value: strict-origin-when-cross-origin

Set static → Header name: Content-Security-Policy → Value: frame-ancestors 'none';
