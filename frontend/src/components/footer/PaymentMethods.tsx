import React from "react";

export default function PaymentMethods() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. American Express */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="American Express">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#016fd0" />
          <path d="M7 6h3.4l1.3 3.2L13 6h3.4v12h-2.5v-7.2L12.4 14h-1.6l-1.5-3.2V18H7V6z" fill="#fff" />
          <path d="M19 6h7.5c1.4 0 2.5 1.1 2.5 2.5v1.2c0 .9-.5 1.7-1.3 2.1 1 .4 1.7 1.3 1.7 2.4V15.5c0 1.4-1.1 2.5-2.5 2.5H19V6zm2.4 4.8h4.5c.3 0 .6-.3.6-.6v-.8c0-.3-.3-.6-.6-.6h-4.5v2zm0 4.8h4.7c.3 0 .6-.3.6-.6v-.9c0-.3-.3-.6-.6-.6h-4.7v2.1z" fill="#fff" />
        </svg>
      </span>

      {/* 2. Apple Pay */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="Apple Pay">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#fff" />
          <path d="M13.4 10.9c-.3.4-.8.7-1.3.6-.1-.5.1-1.1.4-1.4.3-.4.8-.6 1.3-.6.1.5-.1 1-.4 1.4zm.4.8c-.7 0-1.3.4-1.7.4-.4 0-.9-.4-1.5-.4-.8 0-1.5.5-1.9 1.2-.8 1.5-.2 3.7.6 4.9.4.6.9 1.3 1.5 1.3.6 0 .8-.4 1.5-.4.7 0 .9.4 1.5.4.6 0 1.1-.6 1.5-1.2.5-.7.7-1.4.7-1.4-.7-.3-1.1-.9-1.1-1.7 0-1.4 1.1-2 1.2-2.1-.6-.9-1.5-1-1.8-1zm4.7-.6h1.7c1.3 0 2.1.9 2.1 2.2 0 1.3-.9 2.2-2.1 2.2h-.7v2.6h-.9V11.1zm.9 3.6h.7c.8 0 1.3-.5 1.3-1.4 0-.8-.5-1.4-1.3-1.4h-.7v2.8zm6.5 1.5c0-.9.7-1.5 1.8-1.5.6 0 1 .1 1.2.2v-.2c0-.6-.5-1-1.2-1-.5 0-.9.1-1.2.3l-.3-.6c.4-.2 1-.4 1.7-.4 1.3 0 1.9.7 1.9 1.8v3.1h-.9v-.7c-.3.5-.8.8-1.5.8-.9 0-1.5-.6-1.5-1.5zm3.1-.2v-.5c-.2-.1-.6-.2-1-.2-.7 0-1.1.3-1.1.8 0 .5.4.8.9.8.7 0 1.2-.4 1.2-.9zm4.2 3.6l1.5-4.4h1l-2.4 6.3h-1l.9-2.3-2.1-4h1l1.1 3.2z" fill="#000" />
        </svg>
      </span>

      {/* 3. Google Pay */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="Google Pay">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#fff" stroke="#e6e6e6" strokeWidth="0.5" />
          <path d="M15.4 12.2c0-.2 0-.4-.1-.6h-3.4v1.2h2c-.1.5-.4.9-.8 1.2v1h1.3c.8-.7 1-1.7 1-2.8z" fill="#4285F4" />
          <path d="M11.9 15.7c1 0 1.9-.3 2.5-1l-1.3-1c-.3.2-.8.4-1.2.4-.9 0-1.7-.6-2-1.5H8.6v1c.6 1.3 1.9 2.1 3.3 2.1z" fill="#34A853" />
          <path d="M9.9 12.6c-.1-.3-.1-.6-.1-.9 0-.3 0-.6.1-.9V9.8H8.6c-.5 1-1 2.2-1 3.2 0 1.1.5 2.2 1 3.2l1.3-1z" fill="#FBBC04" />
          <path d="M11.9 9.5c.6 0 1.1.2 1.5.6l1.1-1.1C13.8 8.4 12.9 8 11.9 8c-1.4 0-2.7.8-3.3 2.1l1.3 1c.3-.9 1.1-1.6 2-1.6z" fill="#EA4335" />
          <path d="M18.8 10.7v4.6h-.8v-4.6h.8zm3.3 3.4c-.2.4-.7.6-1.2.6-.9 0-1.6-.7-1.6-1.7 0-1 .7-1.7 1.6-1.7.5 0 1 .2 1.2.6v-.5c0-.6-.5-1-1.2-1-.5 0-.9.2-1.2.5l-.5-.5c.4-.4 1-.7 1.7-.7 1.2 0 2 .7 2 1.7v2.7h-.8v-.5zm-.8-.2c.5 0 .8-.3.8-.8 0-.5-.4-.8-.8-.8s-.8.3-.8.8c0 .5.3.8.8.8zm4.8.8l-1.8-4.5h.9l1.3 3.5 1.3-3.5h.9l-2.7 6.4h-.9l1-1.9z" fill="#5F6368" />
        </svg>
      </span>

      {/* 4. Mastercard */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="Mastercard">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#141414" />
          <circle cx="15" cy="12" r="7" fill="#EB001B" />
          <circle cx="23" cy="12" r="7" fill="#F79E1B" />
          <path d="M19 6.8c1.7 1.3 2.8 3.3 2.8 5.2s-1.1 3.9-2.8 5.2c-1.7-1.3-2.8-3.3-2.8-5.2s1.1-3.9 2.8-5.2z" fill="#FF5F00" />
        </svg>
      </span>

      {/* 5. PayPal */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="PayPal">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#003087" />
          <path d="M14.8 6.5h3.6c2.2 0 3.7 1.1 3.4 3.2-.3 2.3-2 3.7-4.1 3.7h-1.4l-.8 4.6h-2.1l1.4-11.5z" fill="#0079C1" />
          <path d="M16.4 8.7h3.3c1.7 0 2.9.8 2.6 2.5-.3 1.9-1.6 3-3.3 3h-1.1l-.8 4.6h-1.8l1.1-10.1z" fill="#00457C" />
          <path d="M14.7 10.3h1.8c1.3 0 2.2.6 2 1.9-.2 1.4-1.2 2.3-2.5 2.3h-.9l-.6 3.5h-1.4l1.6-7.7z" fill="#0079C1" opacity="0.9" />
        </svg>
      </span>

      {/* 6. Shop Pay */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="Shop Pay">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#5A31F4" />
          <path d="M12.5 14.5c.3.3.7.5 1.2.5.6 0 1-.3 1-.7 0-.5-.4-.7-1.1-.9-.9-.3-1.6-.7-1.6-1.6 0-1 .8-1.7 1.9-1.7.6 0 1.1.2 1.5.5l-.4.8c-.3-.2-.7-.4-1.1-.4-.6 0-.9.3-.9.7 0 .4.4.6 1 .8 1 .3 1.7.7 1.7 1.7 0 1.1-.8 1.7-2 1.7-.7 0-1.3-.2-1.7-.6l.4-.9zm5.3-5.2h1v3.2c.2-.3.6-.5 1-.5.9 0 1.5.7 1.5 1.8 0 1.1-.6 1.8-1.5 1.8-.4 0-.8-.2-1-.5v1.9h-1V9.3zm2.5 4.5c0-.6-.3-1-.8-1s-.8.4-.8 1c0 .6.3 1 .8 1s.8-.4.8-1zm3.8-2.6c1.1 0 1.9.8 1.9 1.9s-.8 1.9-1.9 1.9-1.9-.8-1.9-1.9.8-1.9 1.9-1.9zm0 2.9c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4.2-2.8h1v.5c.2-.3.6-.6 1-.6.9 0 1.5.7 1.5 1.8 0 1.1-.6 1.8-1.5 1.8-.4 0-.8-.2-1-.5v1.9h-1v-4.9zm2.5 2.5c0-.6-.3-1-.8-1s-.8.4-.8 1c0 .6.3 1 .8 1s.8-.4.8-1z" fill="#fff" />
        </svg>
      </span>

      {/* 7. UnionPay */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="UnionPay">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#fff" stroke="#e0e0e0" strokeWidth="0.5" />
          <path d="M12.5 5.5h4.6c2.5 0 3.7 1.5 3.3 4.2-.5 3.1-2.5 5.8-6.1 5.8H10l2.5-10z" fill="#D62027" />
          <path d="M16.5 5.5h4.6c2.5 0 3.7 1.5 3.3 4.2-.5 3.1-2.5 5.8-6.1 5.8H14l2.5-10z" fill="#00659E" />
          <path d="M20.5 5.5h4.6c2.5 0 3.7 1.5 3.3 4.2-.5 3.1-2.5 5.8-6.1 5.8H18l2.5-10z" fill="#008375" />
        </svg>
      </span>

      {/* 8. Visa */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="Visa">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#1434CB" />
          <path d="M14.5 15.5l1.6-8h2.5l-1.6 8h-2.5zm7.3-7.8c-.5-.2-1.3-.4-2.2-.4-2.4 0-4.1 1.3-4.1 3.1 0 1.4 1.2 2.1 2.2 2.6 1 .5 1.3.8 1.3 1.2 0 .7-.8 1-1.6 1-.9 0-1.4-.2-2.2-.5l-.3-.2-.3 1.9c.5.2 1.5.4 2.5.4 2.6 0 4.3-1.3 4.3-3.2 0-1.1-.6-1.9-2.1-2.6-.9-.5-1.4-.8-1.4-1.3 0-.4.5-.9 1.5-.9.8 0 1.4.2 1.9.4l.2.1.5-1.6zm7.2 5.1l1.1-3-.7 3h-.4zm2.4 2.7h2.2l-1.9-8h-2.1c-.5 0-.9.3-1.1.7l-3.8 7.3h2.6l.5-1.4h3.2l.4 1.4zm-14.8-8l-2.4 5.5-.3-1.4c-.4-1.5-1.7-3.1-3.2-3.9l2.1 7.8h2.6l3.9-8h-2.7z" fill="#fff" />
        </svg>
      </span>

      {/* 9. Afterpay / Link (Mint green badge with connected loops) */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="Afterpay">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#B2FCE4" />
          <path d="M27.4 6.8l-2.7-1.6-2.7-1.6c-1.8-1-4.1.3-4.1 2.4v.4c0 .2.1.4.3.5l1.3.7c.4.2.8-.1.8-.5v-.8c0-.4.4-.7.8-.5l2.5 1.4 2.4 1.5c.4.2.4.7 0 .9l-2.5 1.4-2.5 1.6c-.4.2-.8-.1-.8-.5v-.4c0-2.1-2.3-3.4-4.1-2.4l-2.7 1.6-2.7 1.6c-1.8 1-1.8 3.7 0 4.7l2.7 1.6 2.7 1.6c1.8 1 4.1-.3 4.1-2.4v-.4c0-.2-.1-.4-.3-.5l-1.3-.7c-.4-.2-.8.1-.8.5v.8c0 .4-.4.7-.8.5l-2.5-1.4-2.5-1.5c-.4-.2-.4-.7 0-.9l2.5-1.4 2.5-1.4c.4-.2.8.1.8.5v.4c0 2.1 2.3 3.4 4.1 2.4l2.7-1.6 2.7-1.6c1.9-1.2 1.9-3.8.1-4.9z" fill="#000" />
        </svg>
      </span>

      {/* 10. Zip */}
      <span className="inline-flex h-[24px] w-[38px] flex-shrink-0" title="Zip">
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
          <rect width="38" height="24" rx="3" fill="#fff" stroke="#e0e0e0" strokeWidth="0.5" />
          <path d="M7 15l.2 2h7.8l-.2-2.2H11v-.2l3.4-2.4-.2-2H6.2l.3 2.1H10v.3z" fill="#1a0826" />
          <path d="M15 10.2l.9 6.8h7.9l-.8-6.8z" fill="#AA8FFF" />
          <path d="M32 12.5c-.2-1.5-1.4-2.4-3-2.4h-5.3l.8 6.8h2.4l-.2-1.3h2.5c2.1-.1 3-1.3 2.8-3.1zm-3 1.1h-2.5l-.2-1.6h2.5c.6 0 .9.3.9.8 0 .2 0 .8-.7.8z" fill="#1a0826" />
          <ellipse cx="16.5" cy="8.4" rx="1.1" ry="1.3" transform="rotate(-45 16.5 8.4)" fill="#1a0826" />
        </svg>
      </span>
    </div>
  );
}
