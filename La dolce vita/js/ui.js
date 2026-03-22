/**
 * ui.js — Utilità UI globali per La Dolce Vita
 * Esporta tutto su window per compatibilità con script non-module
 */

/* ── Inject CSS ─────────────────────────────────────────────── */
(function injectStyles() {
    if (document.getElementById('ui-styles')) return;
    const style = document.createElement('style');
    style.id = 'ui-styles';
    style.textContent = `
        /* Toast container */
        #toast-container {
            position: fixed;
            bottom: 24px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        }
        @media (max-width: 580px) {
            #toast-container {
                right: 50%;
                transform: translateX(50%);
                width: calc(100vw - 32px);
                max-width: 360px;
                align-items: stretch;
            }
        }

        /* Toast element */
        .ui-toast {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(11,22,40,0.14);
            padding: 14px 16px 14px 16px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            min-width: 260px;
            max-width: 360px;
            pointer-events: all;
            animation: toastSlideIn 0.35s cubic-bezier(.23,1.01,.32,1) both;
            border-left: 4px solid #3498db;
            position: relative;
        }
        .ui-toast.toast-success { border-left-color: #27ae60; }
        .ui-toast.toast-error   { border-left-color: #e74c3c; }
        .ui-toast.toast-warning { border-left-color: #f39c12; }
        .ui-toast.toast-info    { border-left-color: #3498db; }

        .ui-toast.toast-hiding {
            animation: toastSlideOut 0.3s ease forwards;
        }

        .ui-toast-icon {
            font-size: 1.1rem;
            flex-shrink: 0;
            margin-top: 1px;
        }
        .ui-toast-body {
            flex: 1;
            font-size: 0.88rem;
            line-height: 1.45;
            color: #1a2940;
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            font-weight: 500;
        }
        .ui-toast-close {
            background: none;
            border: none;
            cursor: pointer;
            color: #94a3b8;
            font-size: 1rem;
            line-height: 1;
            padding: 0 0 0 6px;
            flex-shrink: 0;
            min-height: auto !important;
            min-width: auto !important;
        }
        .ui-toast-close:hover { color: #5a7086; }

        @keyframes toastSlideIn {
            from { transform: translateX(110%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes toastSlideOut {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(110%); opacity: 0; }
        }

        /* Confirm modal */
        #ui-confirm-overlay {
            position: fixed;
            inset: 0;
            background: rgba(10,20,40,0.54);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.2s ease both;
        }
        #ui-confirm-box {
            background: #fff;
            border-radius: 16px;
            padding: 28px 26px 22px;
            width: clamp(280px, 88vw, 400px);
            box-shadow: 0 16px 48px rgba(11,22,40,0.2);
            text-align: center;
        }
        #ui-confirm-box .uc-icon { font-size: 2rem; margin-bottom: 10px; }
        #ui-confirm-box .uc-msg  {
            font-size: 0.95rem;
            color: #1a2940;
            margin-bottom: 22px;
            line-height: 1.5;
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        #ui-confirm-box .uc-btns { display: flex; gap: 12px; justify-content: center; }
        .uc-btn-cancel {
            padding: 10px 22px;
            background: #f0f4f8;
            color: #556b7a;
            border: 1px solid #dde5f0;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            font-family: inherit;
        }
        .uc-btn-confirm {
            padding: 10px 22px;
            background: linear-gradient(135deg, #236093, #3498db);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 700;
            cursor: pointer;
            font-family: inherit;
        }
        .uc-btn-confirm:hover { opacity: 0.9; }
        .uc-btn-cancel:hover  { background: #e2e8f0; }
    `;
    document.head.appendChild(style);
})();

/* ── Toast ──────────────────────────────────────────────────── */
function getToastContainer() {
    let c = document.getElementById('toast-container');
    if (!c) {
        c = document.createElement('div');
        c.id = 'toast-container';
        document.body.appendChild(c);
    }
    return c;
}

window.showToast = function(message, type = 'success', duration = 3500) {
    const container = getToastContainer();

    const icons = {
        success: '✓',
        error:   '✕',
        warning: '⚠',
        info:    'ℹ',
    };

    const toast = document.createElement('div');
    toast.className = `ui-toast toast-${type}`;
    toast.innerHTML = `
        <span class="ui-toast-icon">${icons[type] || 'ℹ'}</span>
        <span class="ui-toast-body">${message}</span>
        <button class="ui-toast-close" aria-label="Chiudi">✕</button>
    `;

    const close = toast.querySelector('.ui-toast-close');

    function removeToast() {
        toast.classList.add('toast-hiding');
        setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 310);
    }

    close.addEventListener('click', removeToast);
    container.appendChild(toast);

    if (duration > 0) {
        setTimeout(removeToast, duration);
    }
};

/* ── Confirm modal ──────────────────────────────────────────── */
window.showConfirm = function(message) {
    return new Promise(resolve => {
        // Remove previous if any
        const prev = document.getElementById('ui-confirm-overlay');
        if (prev) prev.parentNode.removeChild(prev);

        const overlay = document.createElement('div');
        overlay.id = 'ui-confirm-overlay';
        overlay.innerHTML = `
            <div id="ui-confirm-box">
                <div class="uc-icon">⚠️</div>
                <div class="uc-msg">${message}</div>
                <div class="uc-btns">
                    <button class="uc-btn-cancel" id="uc-cancel">Annulla</button>
                    <button class="uc-btn-confirm" id="uc-ok">Conferma</button>
                </div>
            </div>
        `;

        function cleanup(result) {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            resolve(result);
        }

        overlay.querySelector('#uc-ok').addEventListener('click', () => cleanup(true));
        overlay.querySelector('#uc-cancel').addEventListener('click', () => cleanup(false));
        overlay.addEventListener('click', e => { if (e.target === overlay) cleanup(false); });

        document.body.appendChild(overlay);
        overlay.querySelector('#uc-ok').focus();
    });
};

/* ── Button loading state ───────────────────────────────────── */
window.setButtonLoading = function(btn, loading, originalText) {
    if (!btn) return;
    if (loading) {
        btn.disabled = true;
        btn._originalText = btn.textContent;
        btn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;">
            <span style="width:14px;height:14px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block;"></span>
            Salvataggio...
        </span>`;
    } else {
        btn.disabled = false;
        btn.textContent = originalText || btn._originalText || 'Salva';
    }
};
