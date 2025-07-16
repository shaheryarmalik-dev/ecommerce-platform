"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import { useEffect, useCallback, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.tidio.co/sa3vq91vvntjepwlsigjbgakxfxd7hab.js";
    script.async = true;
    document.body.appendChild(script);
    // Hide Tidio widget and default button on load
    function hideTidio() {
      if (window.tidioChatApi) {
        window.tidioChatApi.hide();
        if (window.tidioChatApi.hideWidget) {
          window.tidioChatApi.hideWidget();
        }
      } else {
        document.addEventListener("tidioChat-ready", function () {
          window.tidioChatApi.hide();
          if (window.tidioChatApi.hideWidget) {
            window.tidioChatApi.hideWidget();
          }
        });
      }
    }
    // Wait a bit for Tidio to load, then hide
    setTimeout(hideTidio, 2000);

    // MutationObserver to always hide the Tidio default button
    const observer = new MutationObserver(() => {
      const tidioButton = document.querySelector('iframe[title="Tidio Chat"]');
      if (tidioButton) {
        tidioButton.style.display = "none";
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for Tidio chat open/close events
    function handleTidioEvents(e) {
      if (e.data && typeof e.data === "string" && e.data.indexOf("tidio-chat-opened") !== -1) {
        setChatOpen(true);
      }
      if (e.data && typeof e.data === "string" && e.data.indexOf("tidio-chat-closed") !== -1) {
        setChatOpen(false);
      }
    }
    window.addEventListener("message", handleTidioEvents);

    return () => {
      document.body.removeChild(script);
      observer.disconnect();
      window.removeEventListener("message", handleTidioEvents);
    };
  }, []);

  // Function to show Tidio when button is clicked
  const openChat = useCallback(() => {
    if (window.tidioChatApi) {
      window.tidioChatApi.show();
      window.tidioChatApi.open();
      // Do NOT call hideWidget or hide after opening
    }
  }, []);

  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          {/* Floating Chat Button */}
          {!chatOpen && (
            <button
              onClick={openChat}
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 9999,
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 56,
                height: 56,
                fontSize: 24,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
              aria-label="Open chat"
            >
              💬
            </button>
          )}
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
} 