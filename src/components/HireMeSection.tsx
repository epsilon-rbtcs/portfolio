import React, { useEffect, useState } from 'react';

const TARGET_EMAIL = 'abhadra1606@gmail.com';

function getISTTime(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${formatter.format(new Date())} IST`;
  } catch {
    return '01:00 IST';
  }
}

export const HireMeSection: React.FC = () => {
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [istTime, setIstTime] = useState<string>(getISTTime);

  useEffect(() => {
    const id = window.setInterval(() => setIstTime(getISTTime()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const canSend =
    fromEmail.trim().length > 0 &&
    subject.trim().length > 0 &&
    message.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromEmail.trim() || !fromEmail.includes('@')) {
      setStatusMsg({ text: 'please enter a valid email address', isError: true });
      return;
    }
    if (!subject.trim()) {
      setStatusMsg({ text: 'please add a subject line', isError: true });
      return;
    }
    if (!message.trim()) {
      setStatusMsg({ text: 'please write a short message', isError: true });
      return;
    }

    const mailtoSubject = encodeURIComponent(subject.trim());
    const mailtoBody = encodeURIComponent(
      `From: ${fromEmail.trim()}\n\n${message.trim()}`
    );
    window.location.href = `mailto:${TARGET_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

    setStatusMsg({ text: `opening mail client for ${TARGET_EMAIL}` });
    setFromEmail('');
    setSubject('');
    setMessage('');
    window.setTimeout(() => setStatusMsg(null), 4000);
  };

  return (
    <>
      {/* $ cat why-hire-me.md */}
      <section
        aria-label="Why hire me"
        className="w-full max-w-[840px] mx-auto px-5 sm:px-6 mt-14 sm:mt-16"
      >
        <div className="text-[13px] sm:text-[13.5px] tracking-tight flex items-center gap-2 mb-4">
          <span className="text-[#4a6b1d] dark:text-[#b0c970]">$</span>
          <span className="text-[#3c3b37] dark:text-[#b5ae8c]">cat why-hire-me.md</span>
        </div>

        <div className="border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] px-5 sm:px-7 py-5 sm:py-6 space-y-4 text-[13px] sm:text-[13.5px] leading-[1.75] text-[#272724] dark:text-[#c4c1b7] transition-colors duration-200">
          <p>
            I&apos;m a dev who genuinely enjoys building things, solving problems, and figuring out how technology works. I don't just stick to what I already know; I'm always exploring new tools, experimenting with ideas, and pushing myself to learn more.
          </p>
          <p>
             I enjoy taking ideas from concept to something that actually works and love working on things, others deem difficult or impossible. I may not know everything, but I'm a quick learner, adaptable, and not afraid to ask questions or figure things out along the way.
          </p>
          <p>
            I take ownership of my work, value feedback, and care about doing things right. (strong work ethics)
            Also, I promise I'm more fun to work with than this paragraph makes me sound.
          </p>
        </div>
      </section>

      {/* $ cat hire.me */}
      <section
        aria-label="Contact form"
        className="w-full max-w-[840px] mx-auto px-5 sm:px-6 mt-12 sm:mt-16"
      >
        <div className="text-[13px] sm:text-[13.5px] tracking-tight flex items-center gap-2 mb-4">
          <span className="text-[#4a6b1d] dark:text-[#b0c970]">$</span>
          <span className="text-[#3c3b37] dark:text-[#b5ae8c]">cat hire.me</span>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] transition-colors duration-200"
        >
          {/* to: */}
          <div className="border-b border-[#ebe9e2] dark:border-[#1f1f1d] px-5 py-3 flex items-center gap-3 sm:gap-5">
            <span className="text-[12.5px] sm:text-[13px] text-[#1f6e3a] dark:text-[#78c28c] w-16 sm:w-20 shrink-0">
              to:
            </span>
            <span className="text-[12.5px] sm:text-[13px] text-[#1a1917] dark:text-[#dfd6a7] select-all truncate">
              {TARGET_EMAIL}
            </span>
          </div>

          {/* from: */}
          <div className="border-b border-[#ebe9e2] dark:border-[#1f1f1d] px-5 py-3 flex items-center gap-3 sm:gap-5">
            <label
              htmlFor="hire-from"
              className="text-[12.5px] sm:text-[13px] text-[#1f6e3a] dark:text-[#78c28c] w-16 sm:w-20 shrink-0"
            >
              from:
            </label>
            <input
              id="hire-from"
              type="email"
              value={fromEmail}
              onChange={(e) => {
                setFromEmail(e.target.value);
                if (statusMsg) setStatusMsg(null);
              }}
              placeholder="you@example.com"
              className="w-full bg-transparent text-[12.5px] sm:text-[13px] text-[#1a1917] dark:text-[#dfd6a7] placeholder:italic placeholder:text-[#8a8880] dark:placeholder:text-[#55544e] focus:outline-none"
            />
          </div>

          {/* subject: */}
          <div className="border-b border-[#ebe9e2] dark:border-[#1f1f1d] px-5 py-3 flex items-center gap-3 sm:gap-5">
            <label
              htmlFor="hire-subject"
              className="text-[12.5px] sm:text-[13px] text-[#1f6e3a] dark:text-[#78c28c] w-16 sm:w-20 shrink-0"
            >
              subject:
            </label>
            <input
              id="hire-subject"
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (statusMsg) setStatusMsg(null);
              }}
              placeholder="What's this about?"
              className="w-full bg-transparent text-[12.5px] sm:text-[13px] text-[#1a1917] dark:text-[#dfd6a7] placeholder:italic placeholder:text-[#8a8880] dark:placeholder:text-[#55544e] focus:outline-none"
            />
          </div>

          {/* body */}
          <div className="px-5 pt-4 pb-3.5">
            <label htmlFor="hire-body" className="sr-only">
              Message
            </label>
            <textarea
              id="hire-body"
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (statusMsg) setStatusMsg(null);
              }}
              placeholder="We found your profile and have an opportunity that matches your stack..."
              className="w-full bg-transparent text-[12.5px] sm:text-[13px] leading-[1.7] text-[#272724] dark:text-[#c4c1b7] placeholder:italic placeholder:text-[#8a8880] dark:placeholder:text-[#55544e] resize-none focus:outline-none"
            />

            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="text-[11.5px] min-h-[18px]">
                {statusMsg && (
                  <span
                    className={
                      statusMsg.isError
                        ? 'text-[#a63a22] dark:text-[#cc7d68]'
                        : 'text-[#4a6b1d] dark:text-[#b0c970]'
                    }
                  >
                    {statusMsg.text}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={`text-[12px] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm px-1 py-0.5 ${
                  canSend
                    ? 'text-[#1a1917] dark:text-[#dfd6a7] hover:text-[#000000] dark:hover:text-[#ece4bc]'
                    : 'text-[#6d6c65] hover:text-[#1a1917] dark:hover:text-[#dfd6a7]'
                }`}
              >
                send
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Bottom Footer Bar matching screenshot */}
      <footer className="w-full max-w-[840px] mx-auto px-5 sm:px-6 pt-5 mt-14 sm:mt-16 border-t border-[#e4e2da] dark:border-[#161614] flex items-center justify-between text-[11px] sm:text-[11.5px] text-[#5c5a52] dark:text-[#8f8d84]">
        <div className="tabular-nums">{istTime}</div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors cursor-pointer"
          >
            top ↑
          </button>
        </div>
      </footer>
    </>
  );
};
