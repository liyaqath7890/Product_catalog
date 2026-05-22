import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  ChevronRight,
  Grid,
  HelpCircle,
  LogOut,
  Menu,
  MessageSquare,
  MicOff,
  Search,
  Send,
  Settings,
  User,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/components/AuthProvider';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'Inbox',
    title: 'Joe Lincoln mentioned you in Latest Trends topic',
    time: '18 mins ago',
    meta: 'Web Design 2024',
    message: '@Cody For an expert opinion, check out what Mike has to say on this topic!',
    unread: true,
  },
  {
    id: 2,
    type: 'Team',
    title: 'Leslie Alexander added new tags to Web Redesign 2024',
    time: '53 mins ago',
    meta: 'ACME',
    chips: ['Client-Request', 'Figma', 'Redesign'],
    unread: false,
  },
  {
    id: 3,
    type: 'Following',
    title: 'Guy Hawkins requested access to AirSpace project',
    time: '14 hours ago',
    meta: 'Dev Team',
    action: 'access',
    unread: false,
  },
  {
    id: 4,
    type: 'Inbox',
    title: 'Jane Perez invited you to review a file.',
    time: '3 hours ago',
    meta: '742kb',
    file: 'Launch_nov24.pptx',
    unread: false,
  },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'HR Team',
    text: 'Hello! Next week we are closing the project. Do you have questions?',
    time: '14:04',
    side: 'left',
  },
  {
    id: 2,
    sender: 'You',
    text: 'This is excellent news!',
    time: '14:08',
    side: 'right',
  },
  {
    id: 3,
    sender: 'HR Team',
    text: 'I have checked the features, can not wait to demo them!',
    time: '14:26',
    side: 'left',
  },
  {
    id: 4,
    sender: 'You',
    text: "Haven't seen the build yet. I'll look now.",
    time: '15:52',
    side: 'right',
  },
];

const SUPPORT_REPLIES = [
  'Support team here. I can help you with order status, catalog edits, or onboarding.',
  'I have noted your request and shared it with the operations team.',
  'That sounds good. Please continue and I will stay with you here in real time.',
  'Thanks for the update. I checked the queue and your request is now prioritized.',
];

const Header = ({ onToggleSidebar, sidebarCollapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const pathnames = location.pathname.split('/').filter((item) => item);
  const [activePanel, setActivePanel] = useState(null);
  const [activeNotificationTab, setActiveNotificationTab] = useState('All');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draftMessage, setDraftMessage] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [typing, setTyping] = useState(false);
  const replyTimeoutRef = useRef(null);

  const filteredNotifications = useMemo(() => {
    if (activeNotificationTab === 'All') return notifications;
    return notifications.filter((item) => item.type === activeNotificationTab);
  }, [activeNotificationTab, notifications]);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const profileName = user?.name || 'Catalog User';
  const profileEmail = user?.email || 'support@catalog.app';
  const profileInitials = user?.initials || 'CA';

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  const togglePanel = (panel) => {
    setProfileOpen(false);
    setActivePanel((current) => (current === panel ? null : panel));
  };

  const closeAll = () => {
    setActivePanel(null);
    setProfileOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  };

  const archiveAll = () => {
    setNotifications([]);
  };

  const sendMessage = () => {
    const nextMessage = draftMessage.trim();
    if (!nextMessage) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: 'You',
        text: nextMessage,
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        side: 'right',
      },
    ]);
    setDraftMessage('');
    setTyping(true);

    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }

    replyTimeoutRef.current = setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          sender: 'Support Team',
          text: SUPPORT_REPLIES[Math.floor(Math.random() * SUPPORT_REPLIES.length)],
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          side: 'left',
        },
      ]);
      setTyping(false);
    }, 1200);
  };

  const handleProfileAction = (action) => {
    switch (action) {
      case 'Set status':
        setNotifications((current) => [
          {
            id: Date.now(),
            type: 'Team',
            title: 'Your availability is now set to Online',
            time: 'Just now',
            meta: 'Profile',
            unread: true,
          },
          ...current,
        ]);
        break;
      case 'Mute notifications':
        setIsMuted((current) => !current);
        break;
      case 'Profile':
      case 'Settings':
      case 'Notification settings':
        navigate('/settings');
        break;
      case 'Keyboard shortcuts':
        window.alert('Shortcut tip: use the header search to jump between dashboard sections quickly.');
        break;
      case 'Help':
        window.alert('Help center is coming next. For now, use Settings for workspace preferences.');
        break;
      case 'Log out':
        logout();
        navigate('/auth/login', { replace: true });
        break;
      default:
        break;
    }

    setProfileOpen(false);
  };

  const profileActions = [
    { label: 'Set status', icon: User },
    { label: isMuted ? 'Unmute notifications' : 'Mute notifications', icon: isMuted ? Volume2 : VolumeX },
    { label: 'Profile', icon: User },
    { label: 'Settings', icon: Settings },
    { label: 'Notification settings', icon: Bell },
    { label: 'Keyboard shortcuts', icon: Grid },
    { label: 'Help', icon: HelpCircle },
    { label: 'Log out', icon: LogOut },
  ];

  return (
    <>
      <header className="relative z-40 h-[70px] shrink-0 border-b border-[var(--color-gray-200)] bg-[var(--surface-card)] px-8">
        <div className="flex h-full items-center justify-between gap-6">
          <div className="flex min-w-0 items-center">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="mr-4 rounded-xl p-2 text-[var(--color-gray-500)] transition-all hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
              title={sidebarCollapsed ? 'Open Sidebar' : 'Close Sidebar'}
            >
              <Menu size={20} />
            </button>
            <div className="flex min-w-0 items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-gray-400)]">
              <Link to="/" className="transition-colors hover:text-[var(--color-primary)]">Catalog</Link>
              {pathnames.length > 0 && <ChevronRight size={12} />}
              {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                return isLast ? (
                  <span key={name} className="truncate text-[var(--color-gray-900)]">{name.replace(/-/g, ' ')}</span>
                ) : (
                  <React.Fragment key={name}>
                    <Link to={routeTo} className="transition-colors hover:text-[var(--color-primary)]">{name.replace(/-/g, ' ')}</Link>
                    <ChevronRight size={12} />
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden w-64 items-center rounded-xl border border-transparent bg-[var(--color-gray-100)] px-4 py-2 transition-colors focus-within:border-[var(--color-primary)] focus-within:bg-[var(--surface-card)] focus-within:ring-4 focus-within:ring-[var(--color-primary-light)] lg:flex">
              <Search size={16} className="text-[var(--color-gray-400)]" />
              <input type="text" placeholder="Search shop" className="ml-2 w-full border-none bg-transparent text-sm font-medium text-[var(--color-gray-800)] outline-none placeholder-[var(--color-gray-400)]" />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => togglePanel('notifications')}
                className={`relative rounded-xl p-2 transition-all ${activePanel === 'notifications' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'text-[var(--color-gray-400)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && !isMuted ? <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[#17C653]" /> : null}
              </button>
              <button
                type="button"
                onClick={() => togglePanel('chat')}
                className={`rounded-xl p-2 transition-all ${activePanel === 'chat' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'text-[var(--color-gray-400)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]'}`}
              >
                <MessageSquare size={20} />
              </button>
              <button type="button" className="rounded-xl p-2 text-[var(--color-gray-400)] transition-all hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]">
                <Grid size={20} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setActivePanel(null);
                setProfileOpen((current) => !current);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-sm font-black text-[var(--color-primary)] ring-2 ring-white shadow-lg shadow-[var(--color-primary)]/10 transition-all hover:bg-[var(--color-primary)] hover:text-white"
            >
              {profileInitials}
            </button>
          </div>
        </div>

        {profileOpen ? (
          <div className="absolute right-8 top-[76px] z-50 w-[320px] overflow-hidden rounded-[1.5rem] border border-[var(--table-grid)] bg-[var(--surface-card)] shadow-2xl">
            <div className="flex items-center gap-4 border-b border-[var(--table-grid)] px-5 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] font-black text-[var(--color-primary)]">{profileInitials}</div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-gray-900)]">{profileName}</p>
                <p className="text-xs text-[var(--color-gray-500)]">{profileEmail}</p>
                <p className="text-xs text-[#17C653]">Online</p>
              </div>
            </div>
            <div className="py-2">
              {profileActions.map(({ label, icon: Icon, trailing }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleProfileAction(label === 'Unmute notifications' ? 'Mute notifications' : label)}
                  className="flex w-full items-center justify-between px-5 py-3 text-sm text-[var(--color-gray-700)] transition-standard hover:bg-[var(--surface-muted)]"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} className="text-[var(--color-gray-400)]" />
                    {label}
                  </span>
                  {trailing ? <span className="text-xs font-semibold text-[var(--color-primary)]">{trailing}</span> : <ChevronRight size={14} className="text-[var(--color-gray-300)]" />}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      {activePanel ? <div className="fixed inset-0 z-30 bg-[var(--color-dark)]/25 backdrop-blur-sm" onClick={closeAll} /> : null}

      {activePanel === 'notifications' ? (
        <aside className="fixed right-6 top-[84px] z-40 flex h-[calc(100vh-110px)] w-full max-w-[390px] flex-col overflow-hidden rounded-[1.5rem] border border-[var(--table-grid)] bg-[var(--surface-card)] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--table-grid)] px-5 py-4">
            <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">Notifications</h2>
            <button type="button" onClick={closeAll} className="rounded-xl p-2 text-[var(--color-gray-400)] hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-700)]">
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center gap-5 border-b border-[var(--table-grid)] px-5 pt-4 text-sm font-semibold">
            {['All', 'Inbox', 'Team', 'Following'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveNotificationTab(tab)}
                className={`border-b-2 pb-3 transition-standard ${activeNotificationTab === tab ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-gray-500)]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-[var(--color-gray-500)]">No notifications to show.</div>
            ) : (
              filteredNotifications.map((item) => (
                <div key={item.id} className="border-b border-[var(--table-grid)] px-5 py-4">
                  <div className="flex gap-3">
                    <div className="relative mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-[var(--color-gray-700)]">
                      CH
                      {item.unread && !isMuted ? <span className="absolute -right-0.5 bottom-0 h-2.5 w-2.5 rounded-full bg-[#17C653]" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--color-gray-900)]">{item.title}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-gray-500)]">
                        <span>{item.time}</span>
                        <span>{item.meta}</span>
                      </div>
                      {item.message ? <div className="mt-3 rounded-2xl bg-[var(--surface-muted)] p-3 text-sm text-[var(--color-gray-700)]">{item.message}</div> : null}
                      {item.chips ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.chips.map((chip) => (
                            <span key={chip} className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--color-gray-600)]">{chip}</span>
                          ))}
                        </div>
                      ) : null}
                      {item.file ? <div className="mt-3 rounded-2xl bg-[var(--surface-muted)] px-3 py-3 text-sm text-[var(--color-gray-700)]">{item.file}</div> : null}
                      {item.action === 'access' ? (
                        <div className="mt-3 flex gap-2">
                          <CustomGhostButton label="Decline" />
                          <CustomDarkButton label="Accept" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-3 border-t border-[var(--table-grid)] p-4">
            <CustomGhostButton label="Archive all" className="flex-1" onClick={archiveAll} />
            <CustomGhostButton label="Mark all as read" className="flex-1" onClick={markAllAsRead} />
          </div>
        </aside>
      ) : null}

      {activePanel === 'chat' ? (
        <aside className="fixed right-6 top-[84px] z-40 flex h-[calc(100vh-110px)] w-full max-w-[380px] flex-col overflow-hidden rounded-[1.5rem] border border-[var(--table-grid)] bg-[var(--surface-card)] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--table-grid)] px-5 py-4">
            <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">Chat</h2>
            <button type="button" onClick={closeAll} className="rounded-xl p-2 text-[var(--color-gray-400)] hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-700)]">
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between border-b border-[var(--table-grid)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] font-black text-[var(--color-primary)]">CS</div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-gray-900)]">Support Team</p>
                <p className="text-xs text-[#17C653]">{typing ? 'Agent is typing...' : 'Live support online'}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-5 custom-scrollbar">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.side === 'right' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${message.side === 'right' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--surface-muted)] text-[var(--color-gray-800)]'}`}>
                  <p>{message.text}</p>
                  <p className={`mt-2 text-xs ${message.side === 'right' ? 'text-white/80' : 'text-[var(--color-gray-500)]'}`}>{message.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--table-grid)] p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--table-grid)] bg-[var(--surface-card)] px-3 py-2">
              <input
                type="text"
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Write a message..."
                className="flex-1 border-none bg-transparent text-sm text-[var(--color-gray-800)] outline-none placeholder:text-[var(--color-gray-400)]"
              />
              <button type="button" className="text-[var(--color-gray-400)] hover:text-[var(--color-primary)]">
                <MicOff size={16} />
              </button>
              <button type="button" onClick={sendMessage} className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-dark)] px-3 py-2 text-xs font-semibold text-white">
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
};

const CustomGhostButton = ({ label, className = '', onClick }) => (
  <button type="button" onClick={onClick} className={`rounded-xl border border-[var(--table-grid)] px-4 py-2 text-sm font-semibold text-[var(--color-gray-700)] transition-standard hover:bg-[var(--surface-muted)] ${className}`}>
    {label}
  </button>
);

const CustomDarkButton = ({ label, className = '', onClick }) => (
  <button type="button" onClick={onClick} className={`rounded-xl bg-[var(--color-dark)] px-4 py-2 text-sm font-semibold text-white transition-standard hover:opacity-90 ${className}`}>
    {label}
  </button>
);

export default Header;
