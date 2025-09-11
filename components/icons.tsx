
import React from 'react';

// Using React.SVGProps for better type safety
type IconProps = React.SVGProps<SVGSVGElement>;

export const HomeIcon: React.FC<IconProps> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
);

export const GolfBallIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 12c-2 0-2.5-1.5-3-3" />
    <path d="M12 12c2 0 2.5 1.5 3 3" />
    <path d="M12 12c-2 0-2.5-1.5-3-3" />
    <path d="M12 12c2 0 2.5 1.5 3 3" />
    <path d="M14.5 5.5c0 1.5-1.5 2.5-3 3" />
    <path d="M9.5 18.5c0-1.5 1.5-2.5 3-3" />
    <path d="M6 9c1.5 0 2.5 1.5 3 3" />
    <path d="M18 15c-1.5 0-2.5-1.5-3-3" />
  </svg>
);

export const VideoIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

export const UploadCloudIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
);

export const WrenchIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5.852a.75.75 0 0 1-1.48-.22l-.18-1.082a3.375 3.375 0 0 0-6.494.316l-.18 1.082a.75.75 0 0 1-1.479.22L.05 3.82a3.375 3.375 0 0 0-3.196 6.494l1.082.18a.75.75 0 0 1 .22 1.479l-1.082.18a3.375 3.375 0 0 0 6.494 3.196l1.082-.18a.75.75 0 0 1 .22-1.479l-1.082-.18a3.375 3.375 0 0 0-3.196-6.494l.18-1.082a.75.75 0 0 1 1.479-.22l.18 1.082a3.375 3.375 0 0 0 6.494-.316l.18-1.082a.75.75 0 0 1 1.48.22l.001 1.082a3.375 3.375 0 0 0 3.196 6.494l-1.082.18a.75.75 0 0 1-.22 1.479l1.082.18a3.375 3.375 0 0 0 3.196-6.494l-1.082-.18a.75.75 0 0 1-.22-1.48l1.082-.18a3.375 3.375 0 0 0-6.494-3.196l-1.082.18a.75.75 0 0 1-1.479-.22l.18-1.082A1.875 1.875 0 0 0 11.078 2.25ZM12.24 8.32l-3.956 3.956a.75.75 0 0 0 1.06 1.06l3.956-3.956a.75.75 0 0 0-1.06-1.06Z" clipRule="evenodd" />
      <path d="M11.03 8.47a.75.75 0 0 0-1.06 0l-5.25 5.25a.75.75 0 0 0 0 1.06l3.182 3.182a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06l-3.182-3.182ZM8.47 14.03a.75.75 0 0 1 0-1.06l1.5-1.5a.75.75 0 0 1 1.06 0l1.5 1.5a.75.75 0 0 1 0 1.06l-1.5 1.5a.75.75 0 0 1-1.06 0l-1.5-1.5Z" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-7.19c0-.851.42-1.632 1.125-2.124a6.738 6.738 0 0 1 2.366-1.062 4.123 4.123 0 0 0-.617-3.418Z" clipRule="evenodd" />
      <path d="M5.523 10.685a3.375 3.375 0 0 0 6.75 0c0-1.42-.903-2.658-2.15-3.12a.75.75 0 0 1-.424-1.353 4.875 4.875 0 0 1 8.352 4.473c.012.133.02.267.02.4v.251a3.375 3.375 0 0 1-6.75 0c0-1.42.903-2.658 2.15-3.12a.75.75 0 0 0 .424-1.353 4.875 4.875 0 0 0-8.352-4.473.75.75 0 0 1-1.06.012A4.875 4.875 0 0 0 .75 9.375a3.375 3.375 0 0 1 6.75 0c0 1.42-.903-2.658-2.15 3.12a.75.75 0 0 0-.424 1.353 4.875 4.875 0 0 0 8.352 4.473.75.75 0 0 1 1.06-.012 4.875 4.875 0 0 0 5.026-7.906.75.75 0 0 1-.424-1.353 3.375 3.375 0 0 0-6.75 0c0 1.42.903 2.658 2.15 3.12a.75.75 0 0 1 .424 1.353 4.875 4.875 0 0 1-8.352-4.473.75.75 0 0 0-1.06.012 4.875 4.875 0 0 1-5.026-7.906.75.75 0 0 0 .424-1.353 3.375 3.375 0 0 1 2.15-3.12Z" />
    </svg>
);

export const LightBulbIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59Z" />
      <path fillRule="evenodd" d="M9 16.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75ZM10.5 18.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM12 21a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 0 1.5H12.75A.75.75 0 0 1 12 21Z" clipRule="evenodd" />
    </svg>
);

export const MapPinIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 5.169-4.4c1.52-2.345 2.48-5.053 2.48-7.913A8.25 8.25 0 0 0 12 2.25a8.25 8.25 0 0 0-8.25 8.25c0 2.86.96 5.568 2.48 7.913a16.975 16.975 0 0 0 5.17 4.403Zm1.25-18.006a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5Z" clipRule="evenodd" />
    </svg>
);

export const ChartBarIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 3.75A.75.75 0 0 1 3.75 3h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 3.75ZM3 7.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 7.5ZM3 11.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 3.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 3.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 5.25a3.75 3.75 0 1 0 7.5 0v3a1.5 1.5 0 0 1-1.5 1.5h-4.5A1.5 1.5 0 0 1 6.75 9.75v-3Z" clipRule="evenodd" />
  </svg>
);

export const UserGroupIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63A13.067 13.067 0 0 1 8.625 22.5c-2.472 0-4.786-.684-6.735-1.926a.75.75 0 0 1-.363-.63V19.125ZM15.75 19.125a5.625 5.625 0 0 1 11.25 0v.003l-.001.119a.75.75 0 0 1-.363.63a13.067 13.067 0 0 1-5.25 1.626.75.75 0 0 1-.363-.63V19.125Z" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
  </svg>
);

export const LinkIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M15.75 7.5a3 3 0 0 0-3 3A.75.75 0 0 1 12 9.75a1.5 1.5 0 0 1 1.5-1.5H15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 .75.75h.75a.75.75 0 0 1 0 1.5h-1.5a1.5 1.5 0 0 1-1.5-1.5v-3a3 3 0 0 0 3-3Z" />
    <path d="M8.25 7.5a3 3 0 0 0 3 3v1.5a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 .75.75h.75a.75.75 0 0 1 0 1.5h-1.5a1.5 1.5 0 0 1-1.5-1.5v-3a3 3 0 0 0 3-3h1.5a.75.75 0 0 1 0 1.5H9.75a1.5 1.5 0 0 1-1.5-1.5Z" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 2.055l-1.293.97c-.135.101-.164.297-.087.442.76.95 2.223 2.413 3.173 3.173.145.077.341.048.442-.087l.97-1.293a1.875 1.875 0 0 1 2.055-.694l4.423 1.105c.834.209 1.42.959 1.42 1.819V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
  </svg>
);

export const MapIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.25 3.75a3.75 3.75 0 1 0 7.5 0 3.75 3.75 0 0 0-7.5 0ZM15.75 3.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM4.5 10.5a.75.75 0 0 1 .75.75v.008c0 .867.36 1.663.956 2.212l.163.15c.374.343.82.624 1.298.828v3.002a.75.75 0 0 1-1.5 0v-2.115a4.125 4.125 0 0 1-2.206-3.236A.75.75 0 0 1 4.5 10.5Zm15 0a.75.75 0 0 1 .75.75v.008c0 .867-.36 1.663-.956 2.212l-.163.15c-.374.343-.82.624-1.298.828v3.002a.75.75 0 0 1-1.5 0v-2.115a4.125 4.125 0 0 1 2.206-3.236A.75.75 0 0 1 19.5 10.5Z" clipRule="evenodd" />
  </svg>
);

export const XIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const TargetIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h6a.75.75 0 0 0 0-1.5h-5.25V6Z" clipRule="evenodd" />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
  </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
  </svg>
);

export const FlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.5 3.375a.75.75 0 0 1 .75.75v14.25a.75.75 0 0 1-1.5 0V4.125a.75.75 0 0 1 .75-.75Z" />
    <path d="M5.25 4.125a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 .75.75v8.25a.75.75 0 0 1-.75.75h-4.133a3.75 3.75 0 0 0-3.367 2.087l-.333.666a.75.75 0 0 1-1.333 0l-.333-.666a3.75 3.75 0 0 0-3.367-2.087H6a.75.75 0 0 1-.75-.75V4.125Z" />
  </svg>
);

export const ThumbsUpIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.25 9.75A1.5 1.5 0 0 0 9.75 11.25v4.5A1.5 1.5 0 0 0 11.25 17.25h3.75V21a.75.75 0 0 0 1.28.53l4.03-4.03a.75.75 0 0 0 .22-.53v-4.5a1.5 1.5 0 0 0-1.5-1.5h-1.5a.75.75 0 0 1-.75-.75V6a.75.75 0 0 0-.75-.75H12a.75.75 0 0 0-.75.75v3.75Z" />
    <path d="M3 9.75a1.5 1.5 0 0 1 1.5-1.5h1.5a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75h-1.5A1.5 1.5 0 0 1 3 15.75v-6Z" />
  </svg>
);

export const ThumbsDownIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.75 14.25A1.5 1.5 0 0 0 14.25 12.75v-4.5A1.5 1.5 0 0 0 12.75 6.75H9V3a.75.75 0 0 0-1.28-.53l-4.03 4.03a.75.75 0 0 0-.22.53v4.5a1.5 1.5 0 0 0 1.5 1.5h1.5a.75.75 0 0 1 .75.75V18a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 .75-.75v-3.75Z" />
    <path d="M21 14.25a1.5 1.5 0 0 1-1.5 1.5h-1.5a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 .75-.75h1.5A1.5 1.5 0 0 1 21 8.25v6Z" />
  </svg>
);

export const AdjustmentsHorizontalIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);