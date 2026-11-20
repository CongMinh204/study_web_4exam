// Bộ thẻ có sẵn: PRM393, sinh từ scripts/src/PRM393_SU26_FE.md và PRM392_2025_cau_on_PRM393.md bằng scripts/gen-prm393.mjs.
// Mặt trước: câu hỏi kèm các phương án. Mặt sau: đáp án. Được thêm một lần vào dữ liệu người dùng (store.js).
(window.App = window.App || {}).PACKS = (window.App.PACKS || []).concat(
{
 "id": "prm393-v1",
 "subject": {
  "name": "PRM393",
  "description": "PRM393 · Đề SU26 FE, 50 câu trắc nghiệm Flutter",
  "icon": "code",
  "color": "#38bdf8"
 },
 "sets": [
  {
   "title": "Đề SU26 FE · Tổng hợp 50 câu",
   "description": "Cả đề PRM393 SU26 FE, câu 1–50 · đáp án theo đa số bình luận của sinh viên, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 1. Which Dart feature supports object-oriented programming?\n\nA. Widgets\nB. Classes and objects\nC. Hot reload\nD. Layout builders",
     "B. Classes and objects"
    ],
    [
     "Câu 2. Which method retrieves data from SharedPreferences?\n\nA. get()\nB. read()\nC. fetch()\nD. load()",
     "A. get()"
    ],
    [
     "Câu 3. What is Flutter primarily used for?\n\nA. Designing databases for mobile apps\nB. Creating native applications from a single codebase\nC. Developing server-side applications only\nD. Building operating systems for mobile devices",
     "B. Creating native applications from a single codebase"
    ],
    [
     "Câu 4. Why should state be kept as local as possible?\n\nA. Better animations\nB. Reduce unnecessary rebuilds\nC. Simplify UI\nD. Improve navigation",
     "B. Reduce unnecessary rebuilds"
    ],
    [
     "Câu 5. Which command builds a release APK?\n\nA. flutter run\nB. flutter build apk\nC. flutter doctor\nD. flutter clean",
     "B. flutter build apk"
    ],
    [
     "Câu 6. What happens after successful login?\n\nA. App closes\nB. User session starts\nC. Theme changes\nD. Navigation resets",
     "B. User session starts"
    ],
    [
     "Câu 7. Which widget is an example of implicit animation?\n\nA. AnimatedContainer\nB. AnimationController\nC. Tween\nD. Ticker",
     "A. AnimatedContainer"
    ],
    [
     "Câu 8. What is the primary responsibility of the setState() method?\n\nA. Persist data\nB. Trigger widget rebuild\nC. Navigate screens\nD. Handle async tasks",
     "B. Trigger widget rebuild"
    ],
    [
     "Câu 9. Why is clean architecture beneficial?\n\nA. Fewer files\nB. Easier maintenance and testing\nC. Better UI\nD. Faster builds",
     "B. Easier maintenance and testing"
    ],
    [
     "Câu 10. What is Dart primarily designed for in the Flutter ecosystem?\n\nA. Database management\nB. User interface development\nC. General-purpose programming with UI focus\nD. Network security",
     "C. General-purpose programming with UI focus"
    ],
    [
     "Câu 11. What does the build() method return in a widget?\n\nA. A screen\nB. A widget tree describing the UI\nC. Application state\nD. Rendered pixels",
     "B. A widget tree describing the UI"
    ],
    [
     "Câu 12. Which Flutter test focuses on UI components?\n\nA. Unit test\nB. Widget test\nC. Integration test\nD. Load test",
     "B. Widget test"
    ],
    [
     "Câu 13. What causes unnecessary widget rebuilds?\n\nA. State changes\nB. Overusing setState()\nC. Using Provider\nD. Using const widgets",
     "B. Overusing setState()"
    ],
    [
     "Câu 14. What happens if a non-nullable variable is not initialized in Dart?\n\nA. The app runs normally\nB. A runtime exception occurs\nC. A compile-time error occurs\nD. The value becomes null automatically",
     "C. A compile-time error occurs"
    ],
    [
     "Câu 15. Why is separating UI and state logic recommended?\n\nA. Reduce code size\nB. Improve maintainability\nC. Faster execution\nD. Better animations",
     "B. Improve maintainability"
    ],
    [
     "Câu 16. Why should architecture be decided early?\n\nA. Avoid UI work\nB. Reduce refactoring cost\nC. Improve animations\nD. Change theme",
     "B. Reduce refactoring cost"
    ],
    [
     "Câu 17. What does golden testing verify?\n\nA. API responses\nB. UI appearance consistency\nC. Database state\nD. Authentication",
     "B. UI appearance consistency"
    ],
    [
     "Câu 18. Which Flutter tool helps debug network requests?\n\nA. DevTools\nB. Inspector\nC. Emulator\nD. Hot reload",
     "A. DevTools"
    ],
    [
     "Câu 19. Which platforms can Flutter applications target using a single codebase?\n\nA. Android only\nB. iOS only\nC. Android, iOS, web, and desktop\nD. Web servers only",
     "C. Android, iOS, web, and desktop"
    ],
    [
     "Câu 20. Which widget reacts to async data from local storage?\n\nA. FutureBuilder\nB. StreamBuilder\nC. ListView\nD. Provider",
     "A. FutureBuilder"
    ],
    [
     "Câu 21. Why are widgets lightweight in Flutter?\n\nA. They manage system resources\nB. They are immutable descriptions\nC. They store UI state\nD. They handle rendering directly",
     "B. They are immutable descriptions"
    ],
    [
     "Câu 22. What problem does state hoisting address?\n\nA. API delay\nB. State duplication\nC. Theme conflict\nD. Navigation error",
     "B. State duplication"
    ],
    [
     "Câu 23. What happens when setState() is called in a StatefulWidget?\n\nA. The app restarts\nB. The widget tree is rebuilt\nC. Data is saved permanently\nD. Navigation occurs",
     "B. The widget tree is rebuilt"
    ],
    [
     "Câu 24. Which pattern is commonly used for scalable state management?\n\nA. MVC\nB. BLoC\nC. Singleton\nD. Factory",
     "B. BLoC"
    ],
    [
     "Câu 25. Which input type improves user experience for emails?\n\nA. TextInputType.number\nB. TextInputType.emailAddress\nC. TextInputType.text\nD. TextInputType.url",
     "B. TextInputType.emailAddress"
    ],
    [
     "Câu 26. Which widget allows both scrolling and app bars to interact?\n\nA. ListView\nB. CustomScrollView\nC. GridView\nD. Stack",
     "B. CustomScrollView"
    ],
    [
     "Câu 27. Which method resets all form fields?\n\nA. clear()\nB. reset()\nC. dispose()\nD. remove()",
     "B. reset()"
    ],
    [
     "Câu 28. Why is secure authentication critical in mobile apps?\n\nA. UI quality\nB. Protect user data\nC. Reduce code\nD. Improve speed",
     "B. Protect user data"
    ],
    [
     "Câu 29. Which HTTP method is used to send new data to a server?\n\nA. GET\nB. DELETE\nC. POST\nD. HEAD",
     "C. POST"
    ],
    [
     "Câu 30. What is the main goal of performance optimization in Flutter apps?\n\nA. Improve UI colors\nB. Ensure smooth and responsive UI\nC. Reduce code size\nD. Add features",
     "B. Ensure smooth and responsive UI"
    ],
    [
     "Câu 31. Which widget pattern protects authenticated routes?\n\nA. Navigator\nB. Guard\nC. Route protection\nD. Middleware",
     "B. Guard\n\nGhi chú: bình luận không thống nhất: fesummer2024 chọn B, OysletsLia chọn C. Tôi chọn B (Guard), độ tin cậy thấp."
    ],
    [
     "Câu 32. What does the final keyword indicate in Dart?\n\nA. The variable can be reassigned later\nB. The variable value is fixed after assignment\nC. The variable is global\nD. The variable is private",
     "B. The variable value is fixed after assignment"
    ],
    [
     "Câu 33. What does status code 200 indicate?\n\nA. Client error\nB. Server error\nC. Success\nD. Redirect",
     "C. Success"
    ],
    [
     "Câu 34. Why is immutability important in BLoC states?\n\nA. UI speed\nB. Predictable state changes\nC. Memory usage\nD. Theme control",
     "B. Predictable state changes"
    ],
    [
     "Câu 35. What does crossAxisAlignment control?\n\nA. Vertical alignment in Column\nB. Horizontal alignment in Column\nC. Child order\nD. Widget size",
     "B. Horizontal alignment in Column"
    ],
    [
     "Câu 36. What is the role of v-sync in Flutter?\n\nA. Sync data\nB. Optimize animation resources\nC. Control layout\nD. Handle navigation",
     "B. Optimize animation resources"
    ],
    [
     "Câu 37. What is the main goal of testing in Flutter apps?\n\nA. Improve UI design\nB. Ensure app quality and correctness\nC. Speed up builds\nD. Manage state",
     "B. Ensure app quality and correctness"
    ],
    [
     "Câu 38. Why is understanding the widget lifecycle important?\n\nA. Improve API performance\nB. Manage UI updates correctly\nC. Deploy apps faster\nD. Reduce file size",
     "B. Manage UI updates correctly"
    ],
    [
     "Câu 39. Why are forms important in mobile applications?\n\nA. UI decoration\nB. User data collection\nC. State management\nD. Navigation",
     "B. User data collection"
    ],
    [
     "Câu 40. Which Flutter plugin provides SQLite support?\n\nA. hive\nB. moor\nC. sqflite\nD. shared_preferences",
     "C. sqflite"
    ],
    [
     "Câu 41. When is it most appropriate to customize themes in a Flutter app?\n\nA. After API integration\nB. During UI/UX design phase\nC. Only at deployment\nD. Only for testing",
     "B. During UI/UX design phase"
    ],
    [
     "Câu 42. Which HTTP header is commonly used for authorization?\n\nA. Content-Type\nB. Accept\nC. Authorization\nD. Cache-Control",
     "C. Authorization"
    ],
    [
     "Câu 43. Why is passing context important in navigation?\n\nA. Access theme\nB. Access Navigator\nC. Access state\nD. Access layout",
     "B. Access Navigator"
    ],
    [
     "Câu 44. What is the main benefit of Flutter's widget-based architecture?\n\nA. Widgets are only used for layout design\nB. Widgets allow code reuse across platforms\nC. Widgets automatically manage databases\nD. Widgets replace backend services",
     "B. Widgets allow code reuse across platforms"
    ],
    [
     "Câu 45. Which Dart data structure is best suited for storing an ordered collection of items?\n\nA. Set\nB. Map\nC. List\nD. Queue",
     "C. List"
    ],
    [
     "Câu 46. Which Flutter widget reacts to authentication state changes?\n\nA. FutureBuilder\nB. StreamBuilder\nC. ListView\nD. Form",
     "B. StreamBuilder"
    ],
    [
     "Câu 47. Which widget rebuilds automatically during animation?\n\nA. AnimatedBuilder\nB. FutureBuilder\nC. StreamBuilder\nD. LayoutBuilder",
     "A. AnimatedBuilder"
    ],
    [
     "Câu 48. What is the main purpose of the Container widget?\n\nA. Navigation\nB. Layout, styling, and positioning\nC. State management\nD. Network requests",
     "B. Layout, styling, and positioning"
    ],
    [
     "Câu 49. Which step is required before running a Flutter app for the first time?\n\nA. Publishing the app\nB. Setting up the Flutter SDK\nC. Configuring a database\nD. Writing backend APIs",
     "B. Setting up the Flutter SDK"
    ],
    [
     "Câu 50. Which practice improves API security?\n\nA. Hardcoding keys\nB. Using HTTPS\nC. Ignoring errors\nD. Using globals",
     "B. Using HTTPS"
    ]
   ]
  }
 ]
},
{
 "id": "prm393-topics-v1",
 "extends": "prm393-v1",
 "subject": {
  "name": "PRM393",
  "description": "PRM393 · Đề SU26 FE, 50 câu trắc nghiệm Flutter",
  "icon": "code",
  "color": "#38bdf8"
 },
 "sets": [
  {
   "title": "PRM392 · SharedPreferences",
   "description": "câu hỏi từ đề PRM392 SU25/SP25 FE, chọn lọc phần dùng được cho Flutter · đáp án theo bình luận cộng đồng, không chính thức.",
   "cards": [
    [
     "Câu 1. Which method is used for storing key-value pairs in Android?\n\nA. Internal Storage\nB. External Storage\nC. Shared Preferences\nD. Room database",
     "C. Shared Preferences\n\nGhi chú: Nguồn: PRM392 SU25 FE - Câu 49. Liên hệ Flutter: package `shared_preferences` cũng lưu dữ liệu nhỏ dạng key-value."
    ],
    [
     "Câu 2. What is Shared Preferences used for in Android development?\n\nA. To store large datasets\nB. To store private primitive data in key-value pairs\nC. To manage SQLite databases\nD. To send data over the network",
     "B. To store private primitive data in key-value pairs\n\nGhi chú: Nguồn: PRM392 SU25 FE - Câu 60. Liên hệ Flutter: `SharedPreferences.getInstance()` rồi `setString/setInt/setBool`; chỉ dùng cho kiểu nguyên thủy, không dùng cho dữ liệu lớn."
    ]
   ]
  },
  {
   "title": "PRM392 · SQLite / Room",
   "description": "câu hỏi từ đề PRM392 SU25/SP25 FE, chọn lọc phần dùng được cho Flutter · đáp án theo bình luận cộng đồng, không chính thức.",
   "cards": [
    [
     "Câu 1. Why is it generally recommended to use transactions when performing multiple database operations?\n\nA. Transactions ensure atomicity; either all operations succeed, or none do.\nB. Transactions improve database performance.\nC. Transactions are required by Android's SQLite implementation.\nD. Transactions simplify database code",
     "A. Transactions ensure atomicity; either all operations succeed, or none do.\n\nGhi chú: Nguồn: PRM392 SU25 FE - Câu 48. Liên hệ Flutter: `sqflite` có `db.transaction((txn) async { ... })`; nguyên lý atomicity giống nhau."
    ]
   ]
  },
  {
   "title": "PRM392 · REST API / HTTP",
   "description": "câu hỏi từ đề PRM392 SU25/SP25 FE, chọn lọc phần dùng được cho Flutter · đáp án theo bình luận cộng đồng, không chính thức.",
   "cards": [
    [
     "Câu 1. What is the difference between @Path and @Query annotations in Retrofit?\n\nA. @Path is used to insert values into the URL path, while @Query is used to add parameters to the URL's query string.\nB. @Path encrypts data before sending, whereas @Query sends data in plain text.\nC. @Path is used for POST requests, and @Query is used for GET requests.\nD. @Path and @Query serve the same purpose and can be used interchangeably",
     "A. @Path is used to insert values into the URL path, while @Query is used to add parameters to the URL's query string.\n\nGhi chú: Nguồn: PRM392 SU25 FE - Câu 55. Liên hệ Flutter: tên annotation là của Retrofit, nhưng ý hỏi là khác biệt giữa tham số trong đường dẫn (`/books/5`) và query string (`/books?page=2`), áp dụng y hệt khi gọi API bằng `http` hoặc `dio` (`Uri.parse('$base/books/$id')` so với `queryParameters`). Vì vậy giữ lại."
    ]
   ]
  },
  {
   "title": "PRM392 · Kiến trúc",
   "description": "câu hỏi từ đề PRM392 SU25/SP25 FE, chọn lọc phần dùng được cho Flutter · đáp án theo bình luận cộng đồng, không chính thức.",
   "cards": [
    [
     "Câu 1. Why might MVP be preferred over MVC in Android development?\n\nA. MVP allows for easier unit testing by decoupling the View and the Model through the Presenter\nB. MVP is officially recommended by Google\nC. MVP supports asynchronous data loading natively\nD. MVP is simpler and requires less code",
     "A. MVP allows for easier unit testing by decoupling the View and the Model through the Presenter\n\nGhi chú: Nguồn: PRM392 SU25 FE - Câu 51. Liên hệ Flutter: tách logic ra khỏi widget (ví dụ class `Validators` riêng) thì viết unit test không cần dựng UI."
    ],
    [
     "Câu 2. Consider the following code (class LoginController with LoginView view, LoginModel model; performLogin(username, password) calls model.isValidUser(...) then view.showLoginSuccess() or view.showLoginError()). What is its purpose within an MVC architecture?\n\nA. The Controller handles user input and updates the View based on the Model's data\nB. The Controller directly updates the Model\nC. The View handles the business logic\nD. The Model updates the View directly",
     "A. The Controller handles user input and updates the View based on the Model's data\n\nGhi chú: Nguồn: PRM392 SU25 FE - Câu 52. Liên hệ Flutter: vai trò Controller tương ứng với lớp xử lý sự kiện (controller/notifier) nằm giữa widget và model."
    ],
    [
     "Câu 3. Which role does the ViewModel play in the MVVM architecture?\n\nA. The ViewModel manages the UI state and interacts with the Model.\nB. The ViewModel directly manipulates the View's UI elements.\nC. The ViewModel handles user input events.\nD. The ViewModel is responsible for data persistence.",
     "A. The ViewModel manages the UI state and interacts with the Model.\n\nGhi chú: Nguồn: PRM392 SU25 FE - Câu 54. Liên hệ Flutter: `ChangeNotifier`/`Provider`/`Riverpod Notifier` giữ state, gọi `notifyListeners()` để widget tự build lại."
    ],
    [
     "Câu 4. Which method should be avoided for handling business logic in MVC architecture?\n\nA. View\nB. Model\nC. Controller\nD. Presenter",
     "A. View\n\nGhi chú: Nguồn: PRM392 SP25 FE - Câu 53. Liên hệ Flutter: không đặt business logic trong `build()` của widget."
    ],
    [
     "Câu 5. Which of the following is a key difference between the MVC and MVP architectural patterns?\n\nA. In MVC, the Controller updates the View directly, while in MVP, the View is updated through the Presenter using interfaces.\nB. MVC does not support user input directly, while MVP is designed to handle user input through the Presenter.\nC. In MVC, the Model updates the View directly, while in MVP, the Model updates the View through the Presenter.\nD. MVC is used exclusively for web applications, while MVP is used for both web and mobile applications.",
     "A. In MVC, the Controller updates the View directly, while in MVP, the View is updated through the Presenter using interfaces.\n\nGhi chú: Nguồn: PRM392 SP25 FE - Câu 54."
    ]
   ]
  },
  {
   "title": "PRM392 · SDK, emulator",
   "description": "câu hỏi từ đề PRM392 SU25/SP25 FE, chọn lọc phần dùng được cho Flutter · đáp án theo bình luận cộng đồng, không chính thức.",
   "cards": [
    [
     "Câu 1. What is the purpose of an emulator in Android development?\n\nA. To test the app on real devices only.\nB. To simulate an Android device environment for testing and debugging.\nC. To compile the app's code.\nD. To deploy the app to a Google Play Store.",
     "B. To simulate an Android device environment for testing and debugging.\n\nGhi chú: Nguồn: PRM392 SU25 FE - Câu 37. Liên hệ Flutter: `flutter emulators`, `flutter run` vẫn chạy trên Android emulator."
    ],
    [
     "Câu 2. What is the primary purpose of the Android Software Development Kit (SDK)?\n\nA. To provide pre-built applications for Android devices\nB. To offer a set of tools and libraries for developing Android apps.\nC. To manage the Android operating system updates.\nD. To simulate Android hardware for testing purposes.",
     "B. To offer a set of tools and libraries for developing Android apps.\n\nGhi chú: Nguồn: PRM392 SP25 FE - Câu 37. Liên hệ Flutter: Flutter cần Android SDK để build ra Android (`flutter doctor` kiểm tra), và khái niệm \"SDK = bộ công cụ + thư viện\" giống với Flutter SDK. Giữ lại dù file gợi ý ban đầu định loại."
    ]
   ]
  }
 ]
}
);
