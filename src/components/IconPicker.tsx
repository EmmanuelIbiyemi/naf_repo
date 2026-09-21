import {
  Box,
  FormControl,
  TextField,
  Autocomplete,
  Typography,
} from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { useState, useMemo } from "react";

// Define the icon registry with categorized icons
export const iconRegistry = {
  // Social Media
  Facebook: MuiIcons.Facebook,
  Twitter: MuiIcons.Twitter,
  Instagram: MuiIcons.Instagram,
  LinkedIn: MuiIcons.LinkedIn,
  YouTube: MuiIcons.YouTube,
  Pinterest: MuiIcons.Pinterest,
  WhatsApp: MuiIcons.WhatsApp,
  Telegram: MuiIcons.Telegram,
  TikTok: MuiIcons.MusicNote, // TikTok icon placeholder
  Discord: MuiIcons.Forum,
  Reddit: MuiIcons.Reddit,
  
  // Contact
  Phone: MuiIcons.Phone,
  Call: MuiIcons.Call,
  LocalPhone: MuiIcons.LocalPhone,
  Email: MuiIcons.Email,
  Mail: MuiIcons.Mail,
  MailOutline: MuiIcons.MailOutline,
  Message: MuiIcons.Message,
  Chat: MuiIcons.Chat,
  AlternateEmail: MuiIcons.AlternateEmail,
  ContactMail: MuiIcons.ContactMail,
  ContactPhone: MuiIcons.ContactPhone,
  Sms: MuiIcons.Sms,
  
  // Time & Schedule
  AccessTime: MuiIcons.AccessTime,
  Schedule: MuiIcons.Schedule,
  Today: MuiIcons.Today,
  Event: MuiIcons.Event,
  CalendarToday: MuiIcons.CalendarToday,
  CalendarMonth: MuiIcons.CalendarMonth,
  DateRange: MuiIcons.DateRange,
  WatchLater: MuiIcons.WatchLater,
  Timelapse: MuiIcons.Timelapse,
  History: MuiIcons.History,
  
  // Location & Navigation
  LocationOn: MuiIcons.LocationOn,
  Place: MuiIcons.Place,
  Room: MuiIcons.Room,
  MyLocation: MuiIcons.MyLocation,
  Map: MuiIcons.Map,
  Navigation: MuiIcons.Navigation,
  Explore: MuiIcons.Explore,
  Public: MuiIcons.Public,
  Language: MuiIcons.Language,
  
  // Business & Office
  Business: MuiIcons.Business,
  Work: MuiIcons.Work,
  BusinessCenter: MuiIcons.BusinessCenter,
  Store: MuiIcons.Store,
  Storefront: MuiIcons.Storefront,
  Domain: MuiIcons.Domain,
  CorporateFare: MuiIcons.CorporateFare,
  
  // Education
  School: MuiIcons.School,
  MenuBook: MuiIcons.MenuBook,
  Book: MuiIcons.Book,
  LibraryBooks: MuiIcons.LibraryBooks,
  AutoStories: MuiIcons.AutoStories,
  Class: MuiIcons.Class,
  Science: MuiIcons.Science,
  Calculate: MuiIcons.Calculate,
  
  // Technology & Media
  Computer: MuiIcons.Computer,
  Laptop: MuiIcons.Laptop,
  PhoneIphone: MuiIcons.PhoneIphone,
  Devices: MuiIcons.Devices,
  DesktopWindows: MuiIcons.DesktopWindows,
  Tablet: MuiIcons.Tablet,
  Watch: MuiIcons.Watch,
  Headphones: MuiIcons.Headphones,
  Headset: MuiIcons.Headset,
  Wifi: MuiIcons.Wifi,
  CloudQueue: MuiIcons.CloudQueue,
  CloudUpload: MuiIcons.CloudUpload,
  CloudDownload: MuiIcons.CloudDownload,
  
  // Actions & UI
  ArrowForward: MuiIcons.ArrowForward,
  ArrowBack: MuiIcons.ArrowBack,
  ArrowUpward: MuiIcons.ArrowUpward,
  ArrowDownward: MuiIcons.ArrowDownward,
  ChevronRight: MuiIcons.ChevronRight,
  ChevronLeft: MuiIcons.ChevronLeft,
  ExpandMore: MuiIcons.ExpandMore,
  ExpandLess: MuiIcons.ExpandLess,
  Close: MuiIcons.Close,
  Menu: MuiIcons.Menu,
  MoreVert: MuiIcons.MoreVert,
  MoreHoriz: MuiIcons.MoreHoriz,
  Add: MuiIcons.Add,
  Remove: MuiIcons.Remove,
  Edit: MuiIcons.Edit,
  Delete: MuiIcons.Delete,
  Save: MuiIcons.Save,
  Check: MuiIcons.Check,
  CheckCircle: MuiIcons.CheckCircle,
  Cancel: MuiIcons.Cancel,
  Clear: MuiIcons.Clear,
  Done: MuiIcons.Done,
  DoneAll: MuiIcons.DoneAll,
  
  // Status & Alerts
  Info: MuiIcons.Info,
  InfoOutlined: MuiIcons.InfoOutlined,
  Warning: MuiIcons.Warning,
  WarningAmber: MuiIcons.WarningAmber,
  Error: MuiIcons.Error,
  ErrorOutline: MuiIcons.ErrorOutline,
  ReportProblem: MuiIcons.ReportProblem,
  Verified: MuiIcons.Verified,
  VerifiedUser: MuiIcons.VerifiedUser,
  Shield: MuiIcons.Shield,
  Security: MuiIcons.Security,
  
  // Finance
  AttachMoney: MuiIcons.AttachMoney,
  MonetizationOn: MuiIcons.MonetizationOn,
  Payment: MuiIcons.Payment,
  CreditCard: MuiIcons.CreditCard,
  AccountBalance: MuiIcons.AccountBalance,
  Wallet: MuiIcons.AccountBalanceWallet,
  Receipt: MuiIcons.Receipt,
  ShoppingCart: MuiIcons.ShoppingCart,
  LocalOffer: MuiIcons.LocalOffer,
  
  // People & Community
  Person: MuiIcons.Person,
  People: MuiIcons.People,
  Group: MuiIcons.Group,
  Groups: MuiIcons.Groups,
  PersonAdd: MuiIcons.PersonAdd,
  AccountCircle: MuiIcons.AccountCircle,
  SupervisedUserCircle: MuiIcons.SupervisedUserCircle,
  Face: MuiIcons.Face,
  EmojiPeople: MuiIcons.EmojiPeople,
  
  // Files & Documents
  Description: MuiIcons.Description,
  Article: MuiIcons.Article,
  Notes: MuiIcons.Notes,
  TextSnippet: MuiIcons.TextSnippet,
  Folder: MuiIcons.Folder,
  FolderOpen: MuiIcons.FolderOpen,
  InsertDriveFile: MuiIcons.InsertDriveFile,
  AttachFile: MuiIcons.AttachFile,
  Upload: MuiIcons.Upload,
  Download: MuiIcons.Download,
  FileCopy: MuiIcons.FileCopy,
  PictureAsPdf: MuiIcons.PictureAsPdf,
  
  // Media & Entertainment
  Image: MuiIcons.Image,
  Photo: MuiIcons.Photo,
  PhotoCamera: MuiIcons.PhotoCamera,
  Videocam: MuiIcons.Videocam,
  Movie: MuiIcons.Movie,
  MusicNote: MuiIcons.MusicNote,
  Audiotrack: MuiIcons.Audiotrack,
  PlayArrow: MuiIcons.PlayArrow,
  Pause: MuiIcons.Pause,
  Stop: MuiIcons.Stop,
  VolumeUp: MuiIcons.VolumeUp,
  Mic: MuiIcons.Mic,
  
  // Health & Fitness
  FitnessCenter: MuiIcons.FitnessCenter,
  DirectionsRun: MuiIcons.DirectionsRun,
  DirectionsWalk: MuiIcons.DirectionsWalk,
  DirectionsBike: MuiIcons.DirectionsBike,
  Pool: MuiIcons.Pool,
  SportsBasketball: MuiIcons.SportsBasketball,
  SportsSoccer: MuiIcons.SportsSoccer,
  Favorite: MuiIcons.Favorite,
  FavoriteBorder: MuiIcons.FavoriteBorder,
  LocalHospital: MuiIcons.LocalHospital,
  MedicalServices: MuiIcons.MedicalServices,
  
  // Food & Dining
  Restaurant: MuiIcons.Restaurant,
  LocalDining: MuiIcons.LocalDining,
  Fastfood: MuiIcons.Fastfood,
  LocalCafe: MuiIcons.LocalCafe,
  LocalBar: MuiIcons.LocalBar,
  LocalPizza: MuiIcons.LocalPizza,
  Cake: MuiIcons.Cake,
  Cookie: MuiIcons.Cookie,
  
  // Transportation
  DirectionsCar: MuiIcons.DirectionsCar,
  DirectionsBus: MuiIcons.DirectionsBus,
  DirectionsTransit: MuiIcons.DirectionsTransit,
  Flight: MuiIcons.Flight,
  LocalShipping: MuiIcons.LocalShipping,
  Train: MuiIcons.Train,
  TwoWheeler: MuiIcons.TwoWheeler,
  
  // Home & Living
  Home: MuiIcons.Home,
  House: MuiIcons.House,
  Apartment: MuiIcons.Apartment,
  Bed: MuiIcons.Bed,
  Chair: MuiIcons.Chair,
  Weekend: MuiIcons.Weekend,
  Kitchen: MuiIcons.Kitchen,
  Lightbulb: MuiIcons.Lightbulb,
  
  // Nature & Weather
  WbSunny: MuiIcons.WbSunny,
  NightsStay: MuiIcons.NightsStay,
  Cloud: MuiIcons.Cloud,
  Thunderstorm: MuiIcons.Thunderstorm,
  AcUnit: MuiIcons.AcUnit,
  Terrain: MuiIcons.Terrain,
  Nature: MuiIcons.Nature,
  Park: MuiIcons.Park,
  Forest: MuiIcons.Forest,
  LocalFlorist: MuiIcons.LocalFlorist,
  
  // Tools & Settings
  Settings: MuiIcons.Settings,
  Build: MuiIcons.Build,
  Construction: MuiIcons.Construction,
  Handyman: MuiIcons.Handyman,
  Engineering: MuiIcons.Engineering,
  
  // Shopping & Commerce
  ShoppingBag: MuiIcons.ShoppingBag,
  Inventory: MuiIcons.Inventory,
  Warehouse: MuiIcons.Warehouse,
  LocalMall: MuiIcons.LocalMall,
  
  // Communication
  Forum: MuiIcons.Forum,
  Comment: MuiIcons.Comment,
  QuestionAnswer: MuiIcons.QuestionAnswer,
  Announcement: MuiIcons.Announcement,
  Campaign: MuiIcons.Campaign,
  RecordVoiceOver: MuiIcons.RecordVoiceOver,
  
  // Misc
  Star: MuiIcons.Star,
  StarBorder: MuiIcons.StarBorder,
  StarHalf: MuiIcons.StarHalf,
  Grade: MuiIcons.Grade,
  EmojiEvents: MuiIcons.EmojiEvents,
  Celebration: MuiIcons.Celebration,
  Whatshot: MuiIcons.Whatshot,
  TrendingUp: MuiIcons.TrendingUp,
  TrendingDown: MuiIcons.TrendingDown,
  ThumbUp: MuiIcons.ThumbUp,
  ThumbDown: MuiIcons.ThumbDown,
  Bookmark: MuiIcons.Bookmark,
  BookmarkBorder: MuiIcons.BookmarkBorder,
  Flag: MuiIcons.Flag,
  Visibility: MuiIcons.Visibility,
  VisibilityOff: MuiIcons.VisibilityOff,
  Lock: MuiIcons.Lock,
  LockOpen: MuiIcons.LockOpen,
  Key: MuiIcons.Key,
  VpnKey: MuiIcons.VpnKey,
  Print: MuiIcons.Print,
  QrCode: MuiIcons.QrCode,
  Share: MuiIcons.Share,
  Link: MuiIcons.Link,
  LinkOff: MuiIcons.LinkOff,
  ContentCopy: MuiIcons.ContentCopy,
  ContentPaste: MuiIcons.ContentPaste,
  FilterList: MuiIcons.FilterList,
  Sort: MuiIcons.Sort,
  Search: MuiIcons.Search,
  Refresh: MuiIcons.Refresh,
  Sync: MuiIcons.Sync,
  Loop: MuiIcons.Loop,
  Dashboard: MuiIcons.Dashboard,
  ViewList: MuiIcons.ViewList,
  ViewModule: MuiIcons.ViewModule,
  ViewQuilt: MuiIcons.ViewQuilt,
  GridView: MuiIcons.GridView,
  Apps: MuiIcons.Apps,
  Extension: MuiIcons.Extension,
  Widgets: MuiIcons.Widgets,
  PowerSettingsNew: MuiIcons.PowerSettingsNew,
  Timer: MuiIcons.Timer,
  Alarm: MuiIcons.Alarm,
  Notifications: MuiIcons.Notifications,
  NotificationsActive: MuiIcons.NotificationsActive,
  NotificationsOff: MuiIcons.NotificationsOff,
  BugReport: MuiIcons.BugReport,
  Code: MuiIcons.Code,
  DataObject: MuiIcons.DataObject,
  Terminal: MuiIcons.Terminal,
  BarChart: MuiIcons.BarChart,
  PieChart: MuiIcons.PieChart,
  ShowChart: MuiIcons.ShowChart,
  Analytics: MuiIcons.Analytics,
  Assessment: MuiIcons.Assessment,
  Insights: MuiIcons.Insights,
  LightbulbCircle: MuiIcons.LightbulbCircle,
  LightbulbOutlined: MuiIcons.LightbulbOutlined,
  Quiz: MuiIcons.Quiz,
  HelpOutline: MuiIcons.HelpOutline,
  Help: MuiIcons.Help,
  LiveHelp: MuiIcons.LiveHelp,
  Support: MuiIcons.Support,
  ContactSupport: MuiIcons.ContactSupport,
  Feedback: MuiIcons.Feedback,
  RateReview: MuiIcons.RateReview,
  Reviews: MuiIcons.Reviews,
  AutoAwesome: MuiIcons.AutoAwesome,
  Bolt: MuiIcons.Bolt,
  FlashOn: MuiIcons.FlashOn,
  ElectricBolt: MuiIcons.ElectricBolt,
  Rocket: MuiIcons.RocketLaunch,
  RocketLaunch: MuiIcons.RocketLaunch,
};

export type IconName = keyof typeof iconRegistry;

type IconPickerProps = {
  value?: string;
  onChange: (iconName: string) => void;
  label?: string;
  fullWidth?: boolean;
};

const IconPicker = ({ value, onChange, label = "Icon", fullWidth = true }: IconPickerProps) => {
  const [inputValue, setInputValue] = useState("");
  
  const iconOptions = useMemo(() => {
    return Object.keys(iconRegistry).sort();
  }, []);

  const handleChange = (_event: any, newValue: string | null) => {
    onChange(newValue || "");
  };

  const renderOption = (props: any, option: string) => {
    const IconComponent = iconRegistry[option as IconName];
    return (
      <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {IconComponent && <IconComponent sx={{ fontSize: "1.25rem" }} />}
        <Typography>{option}</Typography>
      </Box>
    );
  };

  const renderInput = (params: any) => {
    const SelectedIconComponent = value && iconRegistry[value as IconName];
    return (
      <TextField
        {...params}
        label={label}
        InputProps={{
          ...params.InputProps,
          startAdornment: SelectedIconComponent ? (
            <Box sx={{ display: "flex", alignItems: "center", marginLeft: 1 }}>
              <SelectedIconComponent sx={{ fontSize: "1.25rem", color: "action.active" }} />
            </Box>
          ) : null,
        }}
      />
    );
  };

  return (
    <FormControl fullWidth={fullWidth}>
      <Autocomplete
        value={value || null}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
        options={iconOptions}
        renderOption={renderOption}
        renderInput={renderInput}
        isOptionEqualToValue={(option, value) => option === value}
        sx={{
          "& .MuiAutocomplete-inputRoot": {
            paddingLeft: value ? "8px" : "14px",
          },
        }}
      />
    </FormControl>
  );
};

export default IconPicker;
