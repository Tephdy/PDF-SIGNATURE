// ===== BACKGROUND ANIMATION CANVAS =====
    const bgCanvas = document.getElementById('bgCanvas');
    const bgCtx = bgCanvas.getContext('2d');
    let particles = [];

    function resizeBgCanvas() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeBgCanvas);
    resizeBgCanvas();

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        radius: Math.random() * 2.5 + 1,
        color: Math.random() > 0.4 ? 'rgba(245, 197, 39, 0.7)' : 'rgba(245, 197, 39, 0.4)',
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    function animateBg() {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            bgCtx.beginPath();
            bgCtx.moveTo(particles[i].x, particles[i].y);
            bgCtx.lineTo(particles[j].x, particles[j].y);
            bgCtx.strokeStyle = `rgba(245, 197, 39, ${0.15 * (1 - dist / 120)})`;
            bgCtx.lineWidth = 1;
            bgCtx.stroke();
          }
        }
      }
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = bgCanvas.width;
        if (p.x > bgCanvas.width) p.x = 0;
        if (p.y < 0) p.y = bgCanvas.height;
        if (p.y > bgCanvas.height) p.y = 0;

        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        bgCtx.fillStyle = p.color;
        bgCtx.fill();
      });
      requestAnimationFrame(animateBg);
    }
    animateBg();

    // ===== VIEW NAVIGATION =====
    const landingView = document.getElementById('landingView');
    const appWorkspace = document.getElementById('appWorkspace');

    function enterEditor() {
      landingView.classList.add('hidden');
      appWorkspace.classList.remove('hidden');
      appWorkspace.classList.add('flex');
      setTimeout(resizeCanvas, 100);
    }

    function exitEditor() {
      appWorkspace.classList.add('hidden');
      appWorkspace.classList.remove('flex');
      landingView.classList.remove('hidden');
      closeMobilePanel();
    }

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function closeMobilePanel() {
      document.getElementById('leftSidebar').classList.remove('mobile-panel-open');
      document.getElementById('rightSidebar').classList.remove('mobile-panel-open');
      document.getElementById('mobilePanelBackdrop').classList.add('hidden');
      document.querySelectorAll('#mobileEditorToolbar button').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
      });
    }

    function toggleMobilePanel(panel) {
      const sidebar = document.getElementById(panel === 'pages' ? 'leftSidebar' : 'rightSidebar');
      const toolbarButton = document.querySelector(
        `#mobileEditorToolbar button[aria-controls="${sidebar.id}"]`
      );
      const wasOpen = sidebar.classList.contains('mobile-panel-open');
      closeMobilePanel();

      if (wasOpen) return;

      sidebar.classList.add('mobile-panel-open');
      document.getElementById('mobilePanelBackdrop').classList.remove('hidden');
      toolbarButton.setAttribute('aria-expanded', 'true');

      if (panel === 'tools') {
        setTimeout(resizeCanvas, 240);
      }
    }

    // ===== TAB SWITCHER =====
    function switchTab(tabId) {
      document.getElementById('signTab').classList.add('hidden');
      document.getElementById('textTab').classList.add('hidden');
      document.getElementById('shapeTab').classList.add('hidden');
      document.getElementById('imageTab').classList.add('hidden');
      
      document.getElementById('btnSignTab').className = 'py-2 rounded-lg text-gray-300 hover:text-white transition';
      document.getElementById('btnTextTab').className = 'py-2 rounded-lg text-gray-300 hover:text-white transition';
      document.getElementById('btnShapeTab').className = 'py-2 rounded-lg text-gray-300 hover:text-white transition';
      document.getElementById('btnImageTab').className = 'py-2 rounded-lg text-gray-300 hover:text-white transition';

      document.getElementById(tabId).classList.remove('hidden');
      if (tabId === 'signTab') document.getElementById('btnSignTab').className = 'py-2 rounded-lg bg-[#F5C527] text-[#17130A] transition';
      if (tabId === 'textTab') document.getElementById('btnTextTab').className = 'py-2 rounded-lg bg-[#F5C527] text-[#17130A] transition';
      if (tabId === 'shapeTab') document.getElementById('btnShapeTab').className = 'py-2 rounded-lg bg-[#F5C527] text-[#17130A] transition';
      if (tabId === 'imageTab') document.getElementById('btnImageTab').className = 'py-2 rounded-lg bg-[#F5C527] text-[#17130A] transition';
      if (tabId === 'signTab') requestAnimationFrame(resizeCanvas);
    }

    // ===== SHAPE SELECTION =====
    let currentSelectedShape = 'rect';
    function selectShape(type) {
      currentSelectedShape = type;
      if (type === 'rect') {
        document.getElementById('shapeRectBtn').className = 'py-2 px-3 rounded-lg bg-[#F5C527] text-[#17130A] text-xs font-medium transition border border-yellow-700';
        document.getElementById('shapeCircleBtn').className = 'py-2 px-3 rounded-lg bg-yellow-950/40 text-gray-300 text-xs font-medium transition border border-yellow-900/50';
      } else {
        document.getElementById('shapeCircleBtn').className = 'py-2 px-3 rounded-lg bg-[#F5C527] text-[#17130A] text-xs font-medium transition border border-yellow-700';
        document.getElementById('shapeRectBtn').className = 'py-2 px-3 rounded-lg bg-yellow-950/40 text-gray-300 text-xs font-medium transition border border-yellow-900/50';
      }
    }

    // ===== MODALS =====
    const modalData = {
      aboutModal: `
        <h2 class="text-2xl font-bold text-white mb-2">About VeloPdf</h2>
        <p class="text-xs text-yellow-400 font-semibold mb-4">Developed by Tephdytech by Joseph Tanay Amandy</p>
        <p>VeloPdf is a browser-based PDF utility developed and maintained by Tephdytech, associated with Joseph Tanay Amandy. It provides tools to view PDF pages, add visible text, shapes, images and hand-drawn marks, rearrange or remove pages, and export an edited copy.</p>
        <h3 class="text-base font-semibold text-white">Publisher and contact</h3>
        <p>This notice identifies the publisher using the name currently provided for the project. It does not establish a registered company, registered office, mailing address, or dedicated support address. For project questions, use the official channel through which you obtained VeloPdf. Do not send sensitive documents or personal information through a public channel.</p>
        <h3 class="text-base font-semibold text-white">Important limitation</h3>
        <p>The service is a document-editing utility, not a law firm, certification authority, records custodian, or provider of legal, financial, or professional advice. A mark placed on a PDF is a visual annotation and is not, by itself, a cryptographic digital signature or proof of identity, consent, delivery, or enforceability.</p>
        <p>Product descriptions are informational and may change as the software changes. Review the applicable terms, privacy, security, and compliance notices before relying on the service for a particular document or workflow.</p>
      `,
      featuresModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Features and acceptable use</h2>
        <p>VeloPdf provides browser-based tools for rendering PDF pages as PNG, JPEG, or WebP images, combining PNG/JPEG images into PDFs, merging, splitting, and rotating PDFs, placing text annotations and shapes, and adding image-based marks. PDF-to-Office, Office-to-PDF, and compression services are not configured. Files used by the available tools are processed in your browser.</p>
        <h3 class="text-base font-semibold text-white">Use and responsibility</h3>
        <p>You are responsible for having the rights and authority to access, modify, upload into your browser, and distribute the documents and images you use. Use the tools lawfully, respect privacy, confidentiality, intellectual property and record-retention duties, and obtain any required consent before modifying or sharing another person's document.</p>
        <p>Editing can change page order, remove content, alter appearance, or fail to preserve features such as forms, metadata, accessibility information, embedded files, or digital-signature validity. Work on a copy, inspect every page and the exported file, and retain the original when it matters.</p>
        <h3 class="text-base font-semibold text-white">No professional or signing assurance</h3>
        <p>Features are provided as general-purpose tools, not as a substitute for legal review, a regulated electronic-signature process, a qualified trust service, or specialist PDF validation. No representation is made that an edited document will satisfy a particular court, regulator, recipient, or contractual requirement.</p>
      `,
      securityModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Security & Protection</h2>
        <p>The application is designed to read and modify the PDF selected by you in your browser. The application code does not include a feature that uploads the selected PDF to a VeloPdf document-processing server. Files and annotations are handled in browser memory while you use the editor; closing or reloading the page can discard unsaved work.</p>
        <h3 class="text-base font-semibold text-white">Limits of this security statement</h3>
        <p>The website loads PDF.js and pdf-lib from third-party content-delivery services. Your browser must contact the site hosting this application and those services to retrieve the page and libraries. Those providers, your network operator, browser, extensions, device, or security software may process connection or diagnostic information under their own practices. This application has not been independently penetration-tested or audited, and this notice is not a guarantee that every dependency or device is secure.</p>
        <p>Use a trusted, updated device and browser, protect access to your device, and avoid editing highly sensitive documents on a shared or compromised device. Review a downloaded file before sharing it.</p>
      `,
      complianceModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Compliance & Governance</h2>
        <p>This notice describes product intentions and does not certify legal or regulatory compliance. The information currently available for VeloPdf is not sufficient to establish that the service, its publisher, hosting arrangements, or every third-party dependency complies with a particular privacy, security, accessibility, records-management, or industry framework.</p>
        <p>Organizations remain responsible for assessing their own legal obligations, conducting vendor and security reviews, obtaining required approvals, and deciding whether the application is appropriate for their data and workflows. Do not rely on this page as a data-processing agreement, security certification, audit report, or legal opinion.</p>
      `,
      termsModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Terms of Service</h2>
        <p><strong>Effective date:</strong> November 1, 2026</p>
        <p>These terms apply to your access to and use of VeloPdf, a browser-based PDF utility published under the Tephdytech name and associated with Joseph Tanay Amandy (“the service”). By using the service, you agree to use it only as permitted by applicable law. If you do not agree, do not use it.</p>
        <h3 class="text-base font-semibold text-white">Permitted use and your documents</h3>
        <p>You must have the rights and authority needed to access, edit, and share each document or image you use. You retain responsibility for your content, its accuracy, the legality of your instructions, and any disclosure or distribution. Do not use the service to infringe rights, violate confidentiality or privacy, evade legal controls, or interfere with the service or another person's systems.</p>
        <h3 class="text-base font-semibold text-white">Service limitations</h3>
        <p>The service is provided free of charge as a general-purpose tool, on an “as available” and “as is” basis to the extent permitted by law. Features may change, be interrupted, contain errors, or become unavailable. No promise is made that a particular PDF will render correctly, that edits will preserve all content or metadata, or that an exported file will meet a specific technical, legal, regulatory, or recipient requirement. Keep your own original and verify every result.</p>
        <p>The service does not provide legal, professional, archival, or electronic-signature advice. A drawn mark or image inserted into a PDF is not automatically a cryptographic signature, identity check, or legally valid electronic signature.</p>
        <h3 class="text-base font-semibold text-white">Liability and changes</h3>
        <p>To the extent permitted by applicable law, the publisher is not responsible for indirect, incidental, special, consequential, or punitive loss, or loss of data, arising from use of or inability to use the service. Nothing in these terms excludes liability or consumer rights that cannot lawfully be excluded or limited. You are responsible for maintaining backups and checking edited documents.</p>
        <p>These terms may be updated when the service or applicable requirements change. The effective date above identifies this version. Continued use after an update indicates use under the updated terms only to the extent permitted by law. No governing-law jurisdiction or dispute venue is specified here; mandatory rights and rules applicable to you remain unaffected.</p>
        <p>This text is a general product notice, not legal advice or a substitute for terms reviewed by a qualified lawyer for the publisher's actual organization, location, and service operations.</p>
      `,
      privacyModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
        <p><strong>Effective date:</strong> November 1, 2026</p>
        <p>This notice explains the intended data handling for VeloPdf, a browser-based utility published under the Tephdytech name and associated with Joseph Tanay Amandy. It describes the application as currently implemented; it is not a claim that no other party processes information when you visit the site.</p>
        <h3 class="text-base font-semibold text-white">PDFs and information you enter</h3>
        <p>The editor reads the PDF file you select in your browser and uses browser memory to render pages and prepare edits. The application does not implement a feature to send that selected PDF to a VeloPdf document-processing server. Text or image content you add is used by the editor to prepare the document you download. Avoid entering sensitive information unless you have assessed the risks of your device, browser, network, and the website's delivery infrastructure.</p>
        <h3 class="text-base font-semibold text-white">Website and third-party requests</h3>
        <p>To display and operate the site, your browser requests the website's files and third-party PDF libraries. Web hosting, content-delivery, network, and security providers may receive technical request information such as an IP address, requested resource, timestamp, browser information, or error data as part of delivering or protecting their services. Their processing is governed by their own notices and settings. This project does not currently describe or control those providers' retention practices.</p>
        <h3 class="text-base font-semibold text-white">Storage, tracking, and retention</h3>
        <p>The editor is not designed to retain your selected PDF on an application account or backend. Temporary browser memory is ordinarily released when the page is closed, but browser downloads, caches, crash reports, extensions, backups, or your device may retain information independently. The application does not currently provide account-based storage or a documented analytics program. See the Cookie Regulations notice for information about cookies and browser storage.</p>
        <h3 class="text-base font-semibold text-white">Choices, questions, and updates</h3>
        <p>You may choose not to use the service, close the page, and manage browser permissions, downloaded files, cookies, and site data through your browser. Privacy rights depend on the applicable law and on who acts as a controller for the relevant processing. The publisher's formal legal identity, address, and privacy contact have not been supplied in the application; use the official project channel through which you obtained it for questions, and do not send sensitive documents through a public channel.</p>
        <p>This notice may be updated as the service or its providers change. It is not a representation of compliance with a particular privacy law and should be reviewed against the publisher's actual hosting and data practices before publication as a formal privacy notice.</p>
      `,
      cookieModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Cookie Regulations</h2>
        <p><strong>Effective date:</strong> November 1, 2026</p>
        <p>The application is not designed to require an account or to set advertising or analytics cookies. It uses ordinary browser capabilities, including in-memory processing and a download initiated by you, to provide PDF editing. Browser vendors or third-party providers involved in delivering the website may use their own technologies; this application does not control their practices.</p>
        <h3 class="text-base font-semibold text-white">Cookies and local storage</h3>
        <p>The current editor does not intentionally write a cookie or use local storage to save your PDFs, annotations, or account profile. Your browser may still maintain cache, history, downloaded files, or other site data, and hosting or security services may use technologies governed by their own policies. These behaviors can change if the site or its dependencies change.</p>
        <h3 class="text-base font-semibold text-white">Your choices</h3>
        <p>You can review or remove cookies and site data using your browser settings, block third-party cookies, or use privacy controls available in your browser. Blocking essential site resources may prevent the editor or its PDF libraries from loading. Applicable consent and disclosure requirements vary by location; this notice is not a determination that a particular legal requirement has been satisfied.</p>
        <p>Review the Privacy Policy for more information about technical requests and third-party services.</p>
      `,
      legalModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Legal Notice</h2>
        <p><strong>Service:</strong> VeloPdf, a browser-based PDF editing utility.</p>
        <p><strong>Publisher name used for this project:</strong> Tephdytech.</p>
        <p><strong>Project attribution:</strong> Joseph Tanay Amandy.</p>
        <h3 class="text-base font-semibold text-white">Publisher information</h3>
        <p>No registered entity name, business registration number, registered office, postal address, or dedicated legal contact has been provided for this project. The names above are project attribution only and should not be read as confirmation of a particular corporate or legal status. A formal public legal notice may require additional publisher details depending on the publisher's location and the locations in which the site is offered.</p>
        <h3 class="text-base font-semibold text-white">Content and responsibility</h3>
        <p>Site text and tools are provided for general informational and document-editing purposes. You are responsible for the content of documents you edit and for verifying the accuracy, completeness, accessibility, signature status, and suitability of any output before relying on or distributing it.</p>
        <p>Product names, third-party library names, and related marks belong to their respective owners. Third-party services and libraries are not represented as sponsors or endorsers of VeloPdf. Nothing in this notice limits rights or liabilities that cannot be limited under applicable law.</p>
        <p>For project-related legal questions, use the official channel through which you obtained the software. Do not send confidential documents through public issue trackers or public contact channels.</p>
      `,
      dataProtModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Data Protection Statement</h2>
        <p><strong>Effective date:</strong> November 1, 2026</p>
        <p>VeloPdf is designed so that the PDF selected in the editor is processed in your browser rather than submitted to an application backend for editing. This reduces the application's direct handling of document contents; it does not mean that no personal data is processed anywhere in the delivery chain.</p>
        <h3 class="text-base font-semibold text-white">Data, purpose, and handling</h3>
        <p>Document contents and annotations are used locally to render, edit, and export the file at your request. Browser and hosting requests needed to deliver the application and third-party libraries may expose technical connection information to the relevant providers. The app does not currently provide user accounts, a cloud document library, or a mechanism to retrieve a PDF after your session.</p>
        <h3 class="text-base font-semibold text-white">Your responsibilities and rights</h3>
        <p>Choose an appropriate device and network, ensure you have authority to process the document, protect downloaded copies, and delete browser downloads or site data when appropriate. Depending on your location and the facts of the processing, privacy law may grant rights such as access, correction, erasure, restriction, objection, or complaint. This project does not collect documents through an account system that would allow it to identify or retrieve them for a rights request.</p>
        <p>The formal controller identity, business address, lawful bases, retention schedules for infrastructure logs, and privacy contact for the publisher and its providers have not been documented here. Those details must be confirmed by the publisher before this text is relied on as a statutory data-protection notice. This is not a claim of “absolute privacy” or legal compliance.</p>
      `,
      zeroKnowModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Local Processing and Data Architecture</h2>
        <p>The editor is designed to process the PDF you select in browser memory and does not implement a VeloPdf cloud account, document upload endpoint, or server-side PDF editing workflow. The application therefore does not receive the selected PDF through an editing API as currently implemented.</p>
        <h3 class="text-base font-semibold text-white">Why “zero-knowledge” is not guaranteed</h3>
        <p>The site and its PDF libraries are delivered over the network, including from third-party content-delivery services. Those services and the website host can observe technical requests needed to load the application. Browser extensions, malware, device administrators, operating systems, crash-reporting tools, or network monitoring may also expose information on your device or connection. The project has not published an independent architecture audit or cryptographic proof.</p>
        <p>For these reasons, this notice describes a local-processing design, not a certified or independently verified zero-knowledge architecture, end-to-end encryption service, or promise of zero cloud exposure. Do not use the application for information whose handling requirements prohibit these residual risks.</p>
      `,
      socModal: `
        <h2 class="text-2xl font-bold text-white mb-4">SOC 2 & GDPR Status</h2>
        <p>This page does not claim that VeloPdf or its publisher is SOC 2 certified, has completed a SOC 2 examination, holds a SOC 2 report, or has been independently audited against GDPR requirements. No such certificate, audit report, independent assessment, or data-processing agreement has been provided for this application.</p>
        <h3 class="text-base font-semibold text-white">GDPR and other privacy laws</h3>
        <p>Whether a privacy law applies, and which party has controller or processor duties, depends on the publisher's and user's circumstances, locations, purposes, and the third-party services involved. Local PDF processing is one design choice; it does not alone establish compliance with GDPR or any other law. Users and organizations must assess their own legal duties, lawful bases, notices, vendor arrangements, transfer rules, security measures, and rights-handling procedures.</p>
        <h3 class="text-base font-semibold text-white">SOC 2</h3>
        <p>SOC 2 is an independent attestation examination against defined trust services criteria, not a general label for security practices. No SOC 2 attestation is represented here. Contact the publisher through an official project channel for verified documentation if it becomes available, and do not treat this statement as a substitute for a vendor risk assessment.</p>
      `,
      vulnModal: `
        <h2 class="text-2xl font-bold text-white mb-4">Vulnerability Disclosure</h2>
        <p>We welcome good-faith reports about security issues affecting VeloPdf. Before testing, obtain authorization for any system you assess. Limit testing to the minimum needed to demonstrate the issue, avoid accessing or modifying other people's data, and do not degrade service, use social engineering, or publicly disclose an unremediated vulnerability.</p>
        <h3 class="text-base font-semibold text-white">How to report</h3>
        <p>Submit a private report through the official channel where you obtained the project, if that channel supports private security reports. Include a concise description, affected version or page, impact, reproducible steps, and any proposed mitigation. Do not include real personal data, confidential documents, credentials, or unnecessary exploit payloads.</p>
        <h3 class="text-base font-semibold text-white">Handling and scope</h3>
        <p>The project will make reasonable efforts to review good-faith reports, but does not promise a response time, bounty, coordinated-disclosure deadline, or outcome. The project currently has no dedicated security contact or published service-level agreement; public issue trackers may expose your report to everyone, so do not post sensitive details there. Third-party hosting providers and libraries have their own reporting processes and are outside this project's direct control.</p>
        <p>This disclosure guidance does not grant authorization to test third-party infrastructure and does not waive applicable law or any party's rights.</p>
      `
    };

    function openModal(modalKey) {
      const modalBackdrop = document.getElementById('modalBackdrop');
      const modalContent = document.getElementById('modalContent');
      modalContent.innerHTML = modalData[modalKey] || '<p>Content not found.</p>';
      modalBackdrop.classList.remove('hidden');
    }

    const conversionToolConfigs = {
      'pdf-to-images': {
        title: 'PDF to Images',
        description: 'Render each page as an image. The images are bundled into a ZIP file.',
        accept: 'application/pdf,.pdf',
        multiple: false,
        button: 'Convert and download ZIP',
        options: `
          <label class="block text-xs font-semibold text-gray-300 mb-2" for="conversionFormat">Image format</label>
          <select id="conversionFormat" name="format">
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
          <label class="block text-xs font-semibold text-gray-300 mt-4 mb-2" for="conversionScale">Image resolution</label>
          <select id="conversionScale" name="scale">
            <option value="1.5">Standard</option>
            <option value="2" selected>High</option>
            <option value="3">Maximum</option>
          </select>
        `,
      },
      'images-to-pdf': {
        title: 'Images to PDF',
        description: 'Combine PNG and JPEG images into one PDF, with one image per page.',
        accept: 'image/png,image/jpeg,.png,.jpg,.jpeg',
        multiple: true,
        button: 'Create and download PDF',
      },
      'merge-pdf': {
        title: 'Merge PDF',
        description: 'Choose two or more PDF files. Pages will be merged in the order shown in the file picker.',
        accept: 'application/pdf,.pdf',
        multiple: true,
        button: 'Merge and download PDF',
      },
      'split-pdf': {
        title: 'Split PDF',
        description: 'Export each page as a separate PDF in one ZIP archive.',
        accept: 'application/pdf,.pdf',
        multiple: false,
        button: 'Split and download ZIP',
      },
      'rotate-pdf': {
        title: 'Rotate PDF',
        description: 'Rotate every page and save a separate copy of the PDF.',
        accept: 'application/pdf,.pdf',
        multiple: false,
        button: 'Rotate and download PDF',
        options: `
          <label class="block text-xs font-semibold text-gray-300 mb-2" for="conversionRotation">Rotation</label>
          <select id="conversionRotation" name="rotation">
            <option value="90">90° clockwise</option>
            <option value="180">180°</option>
            <option value="270">270° clockwise</option>
          </select>
        `,
      },
    };

    function openTool(toolKey) {
      const tool = conversionToolConfigs[toolKey];
      if (!tool) {
        console.error(`Unknown conversion tool: ${toolKey}`);
        return;
      }

      const modalContent = document.getElementById('modalContent');
      modalContent.innerHTML = `
        <h2 class="text-2xl font-bold text-white mb-2">${tool.title}</h2>
        <p>${tool.description}</p>
        <form id="conversionToolForm" class="space-y-4 mt-5">
          <label class="block text-xs font-semibold text-gray-300" for="conversionFiles">Select file${tool.multiple ? 's' : ''}</label>
          <input id="conversionFiles" name="files" type="file" accept="${tool.accept}" ${tool.multiple ? 'multiple' : ''} required />
          ${tool.options || ''}
          <p class="text-xs text-gray-500">Files are processed in this browser and are not uploaded.</p>
          <button type="submit">${tool.button}</button>
          <p id="conversionToolStatus" class="min-h-5 text-xs" aria-live="polite"></p>
        </form>
      `;
      document.getElementById('modalBackdrop').classList.remove('hidden');

      const form = document.getElementById('conversionToolForm');
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const files = [...form.elements.files.files];
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        setConversionStatus('Processing locally…');

        try {
          await runConversionTool(toolKey, files, form);
          setConversionStatus('Done. Your download is ready.', 'success');
        } catch (error) {
          console.error(`Unable to run ${toolKey}:`, error);
          setConversionStatus(error.message || 'The conversion failed. Check that the selected file is valid.', 'error');
        } finally {
          submitButton.disabled = false;
        }
      });

      document.getElementById('conversionFiles').focus();
    }

    window.openTool = openTool;

    function setConversionStatus(message, state = '') {
      const status = document.getElementById('conversionToolStatus');
      if (!status) return;
      status.textContent = message;
      status.dataset.state = state;
    }

    function getSafeFileName(fileName) {
      return fileName.replace(/\.[^.]+$/, '').replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_').slice(0, 100) || 'document';
    }

    function downloadBlob(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function requireFiles(files, type, minimum = 1) {
      if (files.length < minimum) {
        throw new Error(`Select at least ${minimum} ${type === 'pdf' ? 'PDF files' : 'image files'}.`);
      }
      const isValid = file => {
        const name = file.name.toLowerCase();
        return type === 'pdf'
          ? file.type === 'application/pdf' || name.endsWith('.pdf')
          : file.type === 'image/png' || file.type === 'image/jpeg' ||
            /\.(png|jpe?g)$/.test(name);
      };
      if (files.some(file => !isValid(file))) {
        throw new Error(type === 'pdf'
          ? 'Select only PDF files.'
          : 'Select only PNG or JPEG images.');
      }
    }

    async function runConversionTool(toolKey, files, form) {
      const { PDFDocument, degrees } = PDFLib;
      const zip = new JSZip();

      if (toolKey === 'pdf-to-images') {
        requireFiles(files, 'pdf');
        const format = form.elements.format.value;
        const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[format];
        const scale = Number(form.elements.scale.value);
        const pdf = await pdfjsLib.getDocument({ data: await files[0].arrayBuffer() }).promise;

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          setConversionStatus(`Rendering page ${pageNumber} of ${pdf.numPages}…`);
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Your browser could not create an image canvas.');

          await page.render({
            canvasContext: context,
            viewport,
            background: '#ffffff',
          }).promise;

          const imageBlob = await new Promise((resolve, reject) => {
            canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('The browser could not encode this page.')), format, 0.92);
          });
          if (imageBlob.type !== format) {
            throw new Error(`${extension.toUpperCase()} export is not supported by this browser.`);
          }

          const pageLabel = String(pageNumber).padStart(3, '0');
          zip.file(`${getSafeFileName(files[0].name)}-page-${pageLabel}.${extension}`, imageBlob);
          page.cleanup();
          canvas.width = 0;
          canvas.height = 0;
        }

        const archive = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
        downloadBlob(archive, `${getSafeFileName(files[0].name)}-images.zip`);
        return;
      }

      if (toolKey === 'images-to-pdf') {
        requireFiles(files, 'image');
        const output = await PDFDocument.create();
        for (let index = 0; index < files.length; index++) {
          setConversionStatus(`Adding image ${index + 1} of ${files.length}…`);
          const imageBytes = await files[index].arrayBuffer();
          const image = files[index].type === 'image/png' || /\.png$/i.test(files[index].name)
            ? await output.embedPng(imageBytes)
            : await output.embedJpg(imageBytes);
          const page = output.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
        downloadBlob(new Blob([await output.save()], { type: 'application/pdf' }), 'images.pdf');
        return;
      }

      if (toolKey === 'merge-pdf') {
        requireFiles(files, 'pdf', 2);
        const output = await PDFDocument.create();
        for (let index = 0; index < files.length; index++) {
          setConversionStatus(`Merging file ${index + 1} of ${files.length}…`);
          const source = await PDFDocument.load(await files[index].arrayBuffer());
          const pages = await output.copyPages(source, source.getPageIndices());
          pages.forEach(page => output.addPage(page));
        }
        downloadBlob(new Blob([await output.save()], { type: 'application/pdf' }), 'merged.pdf');
        return;
      }

      if (toolKey === 'split-pdf') {
        requireFiles(files, 'pdf');
        const source = await PDFDocument.load(await files[0].arrayBuffer());
        const pageCount = source.getPageCount();
        for (let index = 0; index < pageCount; index++) {
          setConversionStatus(`Exporting page ${index + 1} of ${pageCount}…`);
          const output = await PDFDocument.create();
          const [page] = await output.copyPages(source, [index]);
          output.addPage(page);
          const pageLabel = String(index + 1).padStart(3, '0');
          zip.file(`${getSafeFileName(files[0].name)}-page-${pageLabel}.pdf`, await output.save());
        }
        downloadBlob(await zip.generateAsync({ type: 'blob', compression: 'STORE' }), `${getSafeFileName(files[0].name)}-pages.zip`);
        return;
      }

      if (toolKey === 'rotate-pdf') {
        requireFiles(files, 'pdf');
        const output = await PDFDocument.load(await files[0].arrayBuffer());
        const rotation = Number(form.elements.rotation.value);
        output.getPages().forEach(page => {
          page.setRotation(degrees(page.getRotation().angle + rotation));
        });
        downloadBlob(new Blob([await output.save()], { type: 'application/pdf' }), `${getSafeFileName(files[0].name)}-rotated.pdf`);
      }
    }

    function closeModal() {
      document.getElementById('modalBackdrop').classList.add('hidden');
    }
    document.getElementById('modalBackdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    // ===== PDF & ANNOTATION WORKSPACE LOGIC =====
    const selectPdfBtn = document.getElementById('selectPdfBtn');
    const fileInput = document.getElementById('fileInput');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const pdfViewer = document.getElementById('pdfViewer');
    const mainWorkspace = document.getElementById('mainWorkspace');
    
    const leftSidebar = document.getElementById('leftSidebar');
    const rightSidebar = document.getElementById('rightSidebar');
    const resetBtn = document.getElementById('resetBtn');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const pageCountBadge = document.getElementById('pageCountBadge');
    
    // Sign controls
    const signatureCanvas = document.getElementById('signatureCanvas');
    const clearSignatureBtn = document.getElementById('clearSignatureBtn');
    const useSignatureBtn = document.getElementById('useSignatureBtn');
    const lineWidthSlider = document.getElementById('lineWidthSlider');
    const widthValue = document.getElementById('widthValue');
    const signatureColorPicker = document.getElementById('signatureColorPicker');

    // Text controls
    const addTextBtn = document.getElementById('addTextBtn');
    const textInputContent = document.getElementById('textInputContent');
    const textFontFamily = document.getElementById('textFontFamily');
    const textFontSize = document.getElementById('textFontSize');
    const textColorPicker = document.getElementById('textColorPicker');
    const textFontOptions = {
      Helvetica: { cssFamily: 'Arial, Helvetica, sans-serif', weight: 'normal', style: 'normal' },
      HelveticaBold: { cssFamily: 'Arial, Helvetica, sans-serif', weight: 'bold', style: 'normal' },
      HelveticaOblique: { cssFamily: 'Arial, Helvetica, sans-serif', weight: 'normal', style: 'italic' },
      HelveticaBoldOblique: { cssFamily: 'Arial, Helvetica, sans-serif', weight: 'bold', style: 'italic' },
      TimesRoman: { cssFamily: '"Times New Roman", Times, serif', weight: 'normal', style: 'normal' },
      TimesRomanBold: { cssFamily: '"Times New Roman", Times, serif', weight: 'bold', style: 'normal' },
      TimesRomanItalic: { cssFamily: '"Times New Roman", Times, serif', weight: 'normal', style: 'italic' },
      TimesRomanBoldItalic: { cssFamily: '"Times New Roman", Times, serif', weight: 'bold', style: 'italic' },
      Courier: { cssFamily: '"Courier New", Courier, monospace', weight: 'normal', style: 'normal' },
      CourierBold: { cssFamily: '"Courier New", Courier, monospace', weight: 'bold', style: 'normal' },
      CourierOblique: { cssFamily: '"Courier New", Courier, monospace', weight: 'normal', style: 'italic' },
      CourierBoldOblique: { cssFamily: '"Courier New", Courier, monospace', weight: 'bold', style: 'italic' },
    };

    // Shape controls
    const addShapeBtn = document.getElementById('addShapeBtn');
    const shapeBorderColor = document.getElementById('shapeBorderColor');

    // Image controls
    const selectImageBtn = document.getElementById('selectImageBtn');
    const imageUploadInput = document.getElementById('imageUploadInput');

    const saveChangesBtn = document.getElementById('saveChangesBtn');

    let originalPdfArrayBuffer = null;
    let pdfDoc = null;
    let activePageContainer = null;
    let lastPdfViewportWidth = 0;
    
    let isDrawing = false;
    let lastX = 0, lastY = 0;
    let currentColor = '#000000'; 
    let currentLineWidth = 2.5;

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    selectPdfBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        loadPDF(file);
      }
    });

    async function loadPDF(file) {
      try {
        uploadPlaceholder.classList.add('hidden');
        pdfViewer.classList.remove('hidden');
        
        leftSidebar.classList.remove('hidden'); leftSidebar.classList.add('flex');
        rightSidebar.classList.remove('hidden'); rightSidebar.classList.add('flex');
        appWorkspace.classList.add('has-document');
        closeMobilePanel();
        resetBtn.classList.remove('hidden');
        lastPdfViewportWidth = mainWorkspace.clientWidth;

        pdfViewer.innerHTML = '<div class="text-gray-400 font-medium mt-10">Loading PDF...</div>';
        thumbnailContainer.innerHTML = '';

        originalPdfArrayBuffer = await file.arrayBuffer();
        const loadingArrayBuffer = originalPdfArrayBuffer.slice(0);
        pdfDoc = await pdfjsLib.getDocument({ data: loadingArrayBuffer }).promise;
        pageCountBadge.textContent = pdfDoc.numPages;
        
        await renderPDFViewer();
      } catch (error) {
        console.error(error);
        alert('Error loading PDF.');
      }
    }

    async function renderPDFViewer(preserveAnnotations = false) {
      const activePageNum = activePageContainer
        ? Number(activePageContainer.dataset.pageNum)
        : 1;
      const preservedAnnotations = preserveAnnotations
        ? [...pdfViewer.querySelectorAll('.annotation-overlay')].map(overlay => {
          const overlayRect = overlay.getBoundingClientRect();
          const centerX = overlayRect.left + overlayRect.width / 2;
          const centerY = overlayRect.top + overlayRect.height / 2;
          const page = [...pdfViewer.querySelectorAll('.pdf-page-container')].find(container => {
            const pageRect = container.getBoundingClientRect();
            return centerX >= pageRect.left && centerX <= pageRect.right &&
              centerY >= pageRect.top && centerY <= pageRect.bottom;
          }) || pdfViewer.querySelector('.pdf-page-container');

          if (!page) return null;

          const pageRect = page.getBoundingClientRect();
          const scale = parseFloat(page.dataset.scale) || 1.5;
          return {
            element: overlay,
            pageNum: Number(page.dataset.pageNum),
            x: (overlayRect.left - pageRect.left) / scale,
            y: (overlayRect.top - pageRect.top) / scale,
            width: overlayRect.width / scale,
            height: overlayRect.height / scale,
            textHeight: overlay.style.height,
          };
        }).filter(Boolean)
        : [];

      pdfViewer.innerHTML = '';
      thumbnailContainer.innerHTML = '';
      pdfViewer.style.position = 'relative';

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(240, mainWorkspace.clientWidth - 32);
        const scale = Math.min(1.5, availableWidth / baseViewport.width);
        const viewport = page.getViewport({ scale });
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        
        const pageContainer = document.createElement('div');
        pageContainer.className = 'pdf-page-container';
        pageContainer.dataset.pageNum = i;
        pageContainer.dataset.scale = scale;
        
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        
        pageContainer.appendChild(canvas);
        pdfViewer.appendChild(pageContainer);

        const ctx = canvas.getContext('2d');
        await page.render({
          canvasContext: ctx,
          viewport,
          transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
        }).promise;

        pageContainer.addEventListener('pointerdown', () => {
           document.querySelectorAll('.pdf-page-container').forEach(el => el.classList.remove('active-page'));
           pageContainer.classList.add('active-page');
           activePageContainer = pageContainer;
        });

        // Thumbnail with Reorder & Delete Controls
        const thumbScale = 0.22;
        const thumbViewport = page.getViewport({ scale: thumbScale });
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = thumbViewport.width;
        thumbCanvas.height = thumbViewport.height;
        thumbCanvas.className = 'border border-yellow-900/40 rounded shadow-sm cursor-pointer hover:border-[#F5C527] transition';
        
        const thumbCtx = thumbCanvas.getContext('2d');
        await page.render({ canvasContext: thumbCtx, viewport: thumbViewport }).promise;
        
        const thumbWrapper = document.createElement('div');
        thumbWrapper.className = 'flex flex-col items-center space-y-1 relative bg-yellow-950/20 p-2 rounded-xl border border-yellow-900/30';
        thumbWrapper.appendChild(thumbCanvas);
        
        const labelRow = document.createElement('div');
        labelRow.className = 'flex items-center justify-between w-full px-1 text-xs text-gray-400 mt-1';
        
        const pageNumLabel = document.createElement('span');
        pageNumLabel.textContent = `Page ${i}`;
        labelRow.appendChild(pageNumLabel);

        const actionGroup = document.createElement('div');
        actionGroup.className = 'flex items-center space-x-1.5';

        // Move Up
        if (i > 1) {
          const moveUpBtn = document.createElement('button');
          moveUpBtn.innerHTML = '▲';
          moveUpBtn.title = 'Move Page Up';
          moveUpBtn.className = 'text-[10px] text-yellow-300 hover:text-white bg-yellow-900/50 px-1 rounded transition';
          moveUpBtn.onclick = async (ev) => {
            ev.stopPropagation();
            await movePage(i, i - 1);
          };
          actionGroup.appendChild(moveUpBtn);
        }

        // Move Down
        if (i < pdfDoc.numPages) {
          const moveDownBtn = document.createElement('button');
          moveDownBtn.innerHTML = '▼';
          moveDownBtn.title = 'Move Page Down';
          moveDownBtn.className = 'text-[10px] text-yellow-300 hover:text-white bg-yellow-900/50 px-1 rounded transition';
          moveDownBtn.onclick = async (ev) => {
            ev.stopPropagation();
            await movePage(i, i + 1);
          };
          actionGroup.appendChild(moveDownBtn);
        }

        // Delete Page
        if (pdfDoc.numPages > 1) {
          const deletePageBtn = document.createElement('button');
          deletePageBtn.innerHTML = '🗑️';
          deletePageBtn.title = 'Delete Page';
          deletePageBtn.className = 'text-xs text-red-400 hover:text-red-300 transition px-1';
          deletePageBtn.onclick = async (ev) => {
            ev.stopPropagation();
            if (confirm(`Are you sure you want to delete Page ${i}?`)) {
              await deletePage(i);
            }
          };
          actionGroup.appendChild(deletePageBtn);
        }

        labelRow.appendChild(actionGroup);
        thumbWrapper.appendChild(labelRow);

        thumbCanvas.addEventListener('click', () => {
          pageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          pageContainer.dispatchEvent(new Event('pointerdown'));
          closeMobilePanel();
        });

        thumbnailContainer.appendChild(thumbWrapper);
      }

      preservedAnnotations.forEach(annotation => {
        const page = pdfViewer.querySelector(
          `.pdf-page-container[data-page-num="${annotation.pageNum}"]`
        );
        if (!page) return;

        const scale = parseFloat(page.dataset.scale) || 1.5;
        annotation.element.style.left = `${page.offsetLeft + annotation.x * scale}px`;
        annotation.element.style.top = `${page.offsetTop + annotation.y * scale}px`;
        annotation.element.style.width = `${annotation.width * scale}px`;
        annotation.element.style.height = annotation.textHeight === 'auto'
          ? 'auto'
          : `${annotation.height * scale}px`;
        pdfViewer.appendChild(annotation.element);
      });
      
      const activePage = pdfViewer.querySelector(
        `.pdf-page-container[data-page-num="${activePageNum}"]`
      ) || pdfViewer.querySelector('.pdf-page-container');
      if (activePage) {
          activePage.classList.add('active-page');
          activePageContainer = activePage;
      }
      setTimeout(resizeCanvas, 100);
    }

    async function deletePage(pageNum) {
      try {
        const { PDFDocument } = PDFLib;
        const pdfDocLib = await PDFDocument.load(originalPdfArrayBuffer);
        pdfDocLib.removePage(pageNum - 1);
        const pdfBytes = await pdfDocLib.save();
        originalPdfArrayBuffer = pdfBytes.buffer;
        
        const loadingArrayBuffer = originalPdfArrayBuffer.slice(0);
        pdfDoc = await pdfjsLib.getDocument({ data: loadingArrayBuffer }).promise;
        pageCountBadge.textContent = pdfDoc.numPages;
        await renderPDFViewer();
      } catch (err) {
        console.error(err);
        alert('Failed to delete page.');
      }
    }

    async function movePage(fromIndex, toIndex) {
      try {
        const { PDFDocument } = PDFLib;
        const pdfDocLib = await PDFDocument.load(originalPdfArrayBuffer);
        pdfDocLib.insertPage(toIndex - 1, pdfDocLib.removePage(fromIndex - 1));
        const pdfBytes = await pdfDocLib.save();
        originalPdfArrayBuffer = pdfBytes.buffer;

        const loadingArrayBuffer = originalPdfArrayBuffer.slice(0);
        pdfDoc = await pdfjsLib.getDocument({ data: loadingArrayBuffer }).promise;
        await renderPDFViewer();
      } catch (err) {
        console.error(err);
        alert('Failed to re-order page.');
      }
    }

    resetBtn.addEventListener('click', () => {
      pdfDoc = null;
      originalPdfArrayBuffer = null;
      pdfViewer.innerHTML = '';
      thumbnailContainer.innerHTML = '';
      uploadPlaceholder.classList.remove('hidden');
      pdfViewer.classList.add('hidden');
      leftSidebar.classList.add('hidden'); leftSidebar.classList.remove('flex');
      rightSidebar.classList.add('hidden'); rightSidebar.classList.remove('flex');
      appWorkspace.classList.remove('has-document');
      closeMobilePanel();
      resetBtn.classList.add('hidden');
      fileInput.value = '';
      activePageContainer = null;
    });

    // ===== SIGNATURE CANVAS =====
    const sigCtx = signatureCanvas.getContext('2d');
    function resizeCanvas() {
      if (signatureCanvas.offsetParent === null) return;
      const rect = signatureCanvas.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (signatureCanvas.width === width && signatureCanvas.height === height) return;

      const previousCanvas = document.createElement('canvas');
      previousCanvas.width = signatureCanvas.width;
      previousCanvas.height = signatureCanvas.height;
      previousCanvas.getContext('2d').drawImage(signatureCanvas, 0, 0);

      signatureCanvas.width = width;
      signatureCanvas.height = height;
      sigCtx.drawImage(previousCanvas, 0, 0, width, height);
      updateCanvasStyle();
    }
    function updateCanvasStyle() {
      sigCtx.lineCap = 'round';
      sigCtx.lineJoin = 'round';
      sigCtx.strokeStyle = currentColor;
      sigCtx.lineWidth = currentLineWidth;
    }
    window.addEventListener('resize', resizeCanvas);
    let pdfResizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(pdfResizeTimeout);
      const currentWidth = mainWorkspace.clientWidth;
      if (!pdfDoc || !appWorkspace.classList.contains('has-document') ||
        Math.abs(currentWidth - lastPdfViewportWidth) < 1) return;

      lastPdfViewportWidth = currentWidth;
      pdfResizeTimeout = setTimeout(() => {
        renderPDFViewer(true).catch(error => {
          console.error('Unable to resize PDF preview:', error);
          alert('Unable to resize the PDF preview.');
        });
      }, 250);
    });

    lineWidthSlider.addEventListener('input', (e) => {
      currentLineWidth = parseFloat(e.target.value);
      widthValue.textContent = currentLineWidth;
      updateCanvasStyle();
    });
    signatureColorPicker.addEventListener('input', () => {
      currentColor = signatureColorPicker.value;
      updateCanvasStyle();
    });

    function getPos(e) {
      const rect = signatureCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }
    function startDraw(e) {
      e.preventDefault();
      isDrawing = true;
      const pos = getPos(e);
      lastX = pos.x; lastY = pos.y;
      sigCtx.beginPath();
      sigCtx.moveTo(lastX, lastY);
    }
    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      sigCtx.lineTo(pos.x, pos.y);
      sigCtx.stroke();
      lastX = pos.x; lastY = pos.y;
    }
    function stopDraw() {
      isDrawing = false;
      sigCtx.beginPath();
    }

    signatureCanvas.addEventListener('mousedown', startDraw);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', stopDraw);
    signatureCanvas.addEventListener('mouseleave', stopDraw);
    signatureCanvas.addEventListener('touchstart', startDraw, { passive: false });
    signatureCanvas.addEventListener('touchmove', draw, { passive: false });
    signatureCanvas.addEventListener('touchend', stopDraw);

    clearSignatureBtn.addEventListener('click', () => {
      sigCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    });

    // ===== HELPER: MAKE ELEMENT DRAGGABLE & RESIZABLE =====
    let activeOverlay = null;

    function attachDragAndResize(overlay) {
      const resizeHandle = overlay.querySelector('.resize-handle');
      const deleteBtn = overlay.querySelector('.delete-btn');
      const dragHandle = overlay.querySelector('.annotation-drag-handle');

      deleteBtn.addEventListener('click', () => overlay.remove());

      overlay.addEventListener('pointerdown', (e) => {
        if (e.target.classList.contains('resize-handle') || e.target.classList.contains('delete-btn') || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (overlay.classList.contains('is-text') && !dragHandle?.contains(e.target)) return;
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        activeOverlay = overlay;
        if (dragHandle?.setPointerCapture) {
          dragHandle.setPointerCapture(e.pointerId);
        }
        const viewerRect = pdfViewer.getBoundingClientRect();
        const dragStartX = (e.clientX - viewerRect.left) - overlay.offsetLeft;
        const dragStartY = (e.clientY - viewerRect.top) - overlay.offsetTop;

        function onPointerMove(moveEvent) {
          if (!activeOverlay) return;
          let newX = (moveEvent.clientX - viewerRect.left) - dragStartX;
          let newY = (moveEvent.clientY - viewerRect.top) - dragStartY;
          newX = Math.max(0, Math.min(newX, pdfViewer.clientWidth - overlay.offsetWidth));
          newY = Math.max(0, Math.min(newY, pdfViewer.clientHeight - overlay.offsetHeight));
          overlay.style.left = newX + 'px';
          overlay.style.top = newY + 'px';
        }

        function onPointerUp() {
          activeOverlay = null;
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          window.removeEventListener('pointercancel', onPointerUp);
        }

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
      });

      if (resizeHandle) {
        resizeHandle.addEventListener('pointerdown', (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          e.stopPropagation();

          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = overlay.offsetWidth;
          const startHeight = overlay.offsetHeight;

          function onResizeMove(resizeEvent) {
            const dx = resizeEvent.clientX - startX;
            const dy = resizeEvent.clientY - startY;
            overlay.style.width = Math.max(50, startWidth + dx) + 'px';
            if (!overlay.classList.contains('is-text')) {
              overlay.style.height = Math.max(30, startHeight + dy) + 'px';
            }
          }

          function onResizeUp() {
            window.removeEventListener('pointermove', onResizeMove);
            window.removeEventListener('pointerup', onResizeUp);
          }

          window.addEventListener('pointermove', onResizeMove);
          window.addEventListener('pointerup', onResizeUp);
        });
      }
    }

    // ===== 1. PLACE SIGNATURE =====
    useSignatureBtn.addEventListener('click', () => {
      if (!pdfDoc) return alert('Please load a PDF first.');
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = signatureCanvas.width;
      tempCanvas.height = signatureCanvas.height;
      tempCanvas.getContext('2d').drawImage(signatureCanvas, 0, 0);
      const dataUrl = tempCanvas.toDataURL('image/png');

      const overlay = document.createElement('div');
      overlay.className = 'annotation-overlay';
      overlay.dataset.type = 'image';
      overlay.style.width = '160px';
      overlay.style.height = '70px';
      
      const targetPage = activePageContainer || pdfViewer.querySelector('.pdf-page-container');
      if (targetPage) {
        overlay.style.left = (targetPage.offsetLeft + 50) + 'px';
        overlay.style.top = (targetPage.offsetTop + 100) + 'px';
      }

      overlay.innerHTML = `
        <div class="delete-btn">×</div>
        <img src="${dataUrl}" style="width:100%; height:100%; object-fit:contain; pointer-events:none;" />
        <div class="resize-handle"></div>
      `;

      pdfViewer.appendChild(overlay);
      attachDragAndResize(overlay);
      closeMobilePanel();
    });

    // ===== 2. PLACE TEXT ANNOTATION =====
    addTextBtn.addEventListener('click', () => {
      if (!pdfDoc) return alert('Please load a PDF first.');
      const textVal = textInputContent.value.trim() || 'Sample Text';
      const fontKey = textFontFamily.value;
      const fontOptions = textFontOptions[fontKey];
      const fontSize = textFontSize.value;
      const color = textColorPicker.value;

      if (!fontOptions) {
        console.error(`Unsupported text font: ${fontKey}`);
        return alert('The selected font is not supported.');
      }

      const overlay = document.createElement('div');
      overlay.className = 'annotation-overlay is-text';
      overlay.dataset.type = 'text';
      overlay.style.width = '200px';
      overlay.style.height = 'auto';

      const targetPage = activePageContainer || pdfViewer.querySelector('.pdf-page-container');
      if (targetPage) {
        overlay.style.left = (targetPage.offsetLeft + 50) + 'px';
        overlay.style.top = (targetPage.offsetTop + 150) + 'px';
      }

      overlay.innerHTML = '<div class="delete-btn">×</div><div class="resize-handle"></div>';
      const dragHandle = document.createElement('button');
      dragHandle.type = 'button';
      dragHandle.className = 'annotation-drag-handle';
      dragHandle.setAttribute('aria-label', 'Drag text annotation');
      dragHandle.title = 'Drag text';
      dragHandle.textContent = '↕';
      overlay.appendChild(dragHandle);
      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.className = 'annotation-text';
      textInput.value = textVal;
      textInput.dataset.pdfFont = fontKey;
      textInput.style.fontFamily = fontOptions.cssFamily;
      textInput.style.fontSize = `${fontSize}px`;
      textInput.style.fontWeight = fontOptions.weight;
      textInput.style.fontStyle = fontOptions.style;
      textInput.style.color = color;
      overlay.insertBefore(textInput, overlay.querySelector('.resize-handle'));

      pdfViewer.appendChild(overlay);
      attachDragAndResize(overlay);
      closeMobilePanel();
    });

    // ===== 3. PLACE SHAPE =====
    addShapeBtn.addEventListener('click', () => {
      if (!pdfDoc) return alert('Please load a PDF first.');
      const borderColor = shapeBorderColor.value;

      const overlay = document.createElement('div');
      overlay.className = 'annotation-overlay';
      overlay.dataset.type = 'shape';
      overlay.dataset.shapeType = currentSelectedShape;
      overlay.style.width = '120px';
      overlay.style.height = '80px';
      if (currentSelectedShape === 'circle') overlay.style.borderRadius = '50%';

      const targetPage = activePageContainer || pdfViewer.querySelector('.pdf-page-container');
      if (targetPage) {
        overlay.style.left = (targetPage.offsetLeft + 80) + 'px';
        overlay.style.top = (targetPage.offsetTop + 200) + 'px';
      }

      overlay.style.border = `3px solid ${borderColor}`;
      overlay.style.background = 'transparent';

      overlay.innerHTML = `
        <div class="delete-btn">×</div>
        <div style="width:100%; height:100%;"></div>
        <div class="resize-handle"></div>
      `;

      pdfViewer.appendChild(overlay);
      attachDragAndResize(overlay);
      closeMobilePanel();
    });

    // ===== 4. INSERT CUSTOM IMAGE =====
    selectImageBtn.addEventListener('click', () => imageUploadInput.click());
    imageUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(event) {
        const imageUrl = event.target.result;
        const overlay = document.createElement('div');
        overlay.className = 'annotation-overlay';
        overlay.dataset.type = 'image';
        overlay.style.width = '180px';
        overlay.style.height = '120px';

        const targetPage = activePageContainer || pdfViewer.querySelector('.pdf-page-container');
        if (targetPage) {
          overlay.style.left = (targetPage.offsetLeft + 60) + 'px';
          overlay.style.top = (targetPage.offsetTop + 120) + 'px';
        }

        overlay.innerHTML = `
          <div class="delete-btn">×</div>
          <img src="${imageUrl}" style="width:100%; height:100%; object-fit:contain; pointer-events:none;" />
          <div class="resize-handle"></div>
        `;

        pdfViewer.appendChild(overlay);
        attachDragAndResize(overlay);
        imageUploadInput.value = '';
        closeMobilePanel();
      };
      reader.readAsDataURL(file);
    });

    // ===== SAVE & DOWNLOAD =====
    saveChangesBtn.addEventListener('click', async () => {
      if (!pdfDoc) return alert('Please load a PDF first.');
      if (!originalPdfArrayBuffer) return alert("Original PDF data missing. Please reload.");

      const overlays = pdfViewer.querySelectorAll('.annotation-overlay');

      const originalBtnHTML = saveChangesBtn.innerHTML;
      saveChangesBtn.disabled = true;
      saveChangesBtn.innerHTML = '<div class="spinner"></div><span class="ml-2">Processing PDF...</span>';
      saveChangesBtn.classList.add('opacity-80', 'cursor-not-allowed');

      try {
        const { PDFDocument, StandardFonts, rgb } = PDFLib;
        const pdfDocLib = await PDFDocument.load(originalPdfArrayBuffer);
        const pages = pdfViewer.querySelectorAll('.pdf-page-container');
        const embeddedFonts = new Map();

        for (const overlay of overlays) {
          const rect = overlay.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          let targetPageNum = 1;
          let targetPageContainer = null;

          pages.forEach(page => {
            const pRect = page.getBoundingClientRect();
            if (centerX >= pRect.left && centerX <= pRect.right &&
                centerY >= pRect.top && centerY <= pRect.bottom) {
              targetPageNum = parseInt(page.dataset.pageNum);
              targetPageContainer = page;
            }
          });

          if (!targetPageContainer) {
            targetPageNum = 1;
            targetPageContainer = pages[0];
          }

          const pageIndex = targetPageNum - 1;
          const pdfPage = pdfDocLib.getPage(pageIndex);
          const { width: pdfWidth, height: pdfHeight } = pdfPage.getSize();

          const pageRect = targetPageContainer.getBoundingClientRect();
          const relativeX = rect.left - pageRect.left;
          const relativeY = rect.top - pageRect.top;

          const scale = parseFloat(targetPageContainer.dataset.scale) || 1.5;
          const widthPdf = rect.width / scale;
          const heightPdf = rect.height / scale;
          const xPdf = relativeX / scale;
          const yPdf = pdfHeight - (relativeY / scale) - heightPdf;

          const annType = overlay.dataset.type;

          if (annType === 'image') {
            const imgEl = overlay.querySelector('img');
            const pngImage = await pdfDocLib.embedPng(imgEl.src);
            pdfPage.drawImage(pngImage, { x: xPdf, y: yPdf, width: widthPdf, height: heightPdf });
          } 
          else if (annType === 'text') {
            const textInput = overlay.querySelector('input');
            const inputVal = textInput.value;
            const colorStyle = textInput.style.color || '#000000';
            const fontSizePx = parseFloat(textInput.style.fontSize) || 16;
            const fontKey = textInput.dataset.pdfFont || 'Helvetica';
            const fontName = StandardFonts[fontKey];
            if (!fontName) throw new Error(`Unsupported PDF font: ${fontKey}`);
            if (!embeddedFonts.has(fontKey)) {
              embeddedFonts.set(fontKey, pdfDocLib.embedFont(fontName));
            }
            const font = await embeddedFonts.get(fontKey);
            
            let r = 0, g = 0, b = 0;
            if (colorStyle.startsWith('#')) {
              let hex = colorStyle.replace('#', '');
              if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
              r = parseInt(hex.substring(0,2), 16) / 255;
              g = parseInt(hex.substring(2,4), 16) / 255;
              b = parseInt(hex.substring(4,6), 16) / 255;
            }

            pdfPage.drawText(inputVal, {
              x: xPdf + 4,
              y: yPdf + (heightPdf / 3),
              size: fontSizePx / scale,
              color: rgb(r, g, b),
              font,
            });
          } 
          else if (annType === 'shape') {
            pdfPage.drawRectangle({
              x: xPdf,
              y: yPdf,
              width: widthPdf,
              height: heightPdf,
              borderColor: rgb(0.8, 0.05, 0.35),
              borderWidth: 2,
            });
          }
        }

        const pdfBytes = await pdfDocLib.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'velopdf-edited-document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to save PDF. Check console for details.");
      } finally {
        saveChangesBtn.disabled = false;
        saveChangesBtn.innerHTML = originalBtnHTML;
        saveChangesBtn.classList.remove('opacity-80', 'cursor-not-allowed');
      }
    });
