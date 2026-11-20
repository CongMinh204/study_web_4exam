# PRM392 2025: các câu dùng được để ôn PRM393 (Flutter/Dart)

Lọc từ file `PRM392_2025_theo_chu_de.md` (đề SU25 FE và SP25 FE, nguồn FuOverflow, đáp án theo bình luận cộng đồng, không chính thức).

Tiêu chí lọc: **giữ** câu hỏi về khái niệm chung, áp dụng được khi làm app Flutter. **Loại** câu chỉ đúng với cú pháp hoặc API riêng của Android/Java (SQLiteOpenHelper, Cursor, Retrofit, RecyclerView, Activity, build.gradle...). Mỗi câu giữ lại có thêm dòng "Liên hệ Flutter" để nối sang kiến thức PRM393.

Ký hiệu: **(trùng)** = câu giống hệt nhau giữa hai đề, chỉ in chi tiết một lần.

## Bảng tổng hợp

| Chủ đề | SU25 FE | SP25 FE |
|---|---|---|
| 1. SharedPreferences | 49, 60 | - |
| 2. SQLite / Room (khái niệm transaction) | 48 | 52 (trùng SU25 48) |
| 3. REST API / HTTP (khái niệm URL) | 55 | 58 (trùng SU25 55) |
| 4. Kiến trúc (MVC/MVVM/MVP, tách UI và logic) | 51, 52, 54 | 53, 54 |
| 5. Testing | 51 (xem mục 4) | - |
| 6. SDK, emulator | 37 | 37 |
| 7. Form / nhập liệu | - | - |
| 8. Cập nhật UI khi dữ liệu đổi | 54 (xem mục 4) | - |

Tổng: 11 câu khác nhau (13 nếu tính cả 2 câu trùng). Bị loại: 14 câu, liệt kê ở cuối file.

---

## 1. SharedPreferences

### PRM392 SU25 FE - Câu 49
Which method is used for storing key-value pairs in Android?

- A. Internal Storage
- B. External Storage
- C. Shared Preferences
- D. Room database

**Đáp án: C**

Liên hệ Flutter: package `shared_preferences` cũng lưu dữ liệu nhỏ dạng key-value.

### PRM392 SU25 FE - Câu 60
What is Shared Preferences used for in Android development?

- A. To store large datasets
- B. To store private primitive data in key-value pairs
- C. To manage SQLite databases
- D. To send data over the network

**Đáp án: B**

Liên hệ Flutter: `SharedPreferences.getInstance()` rồi `setString/setInt/setBool`; chỉ dùng cho kiểu nguyên thủy, không dùng cho dữ liệu lớn.

## 2. SQLite / Room (khái niệm transaction)

### PRM392 SU25 FE - Câu 48 (trùng SP25 FE - Câu 52)
Why is it generally recommended to use transactions when performing multiple database operations?

- A. Transactions ensure atomicity; either all operations succeed, or none do.
- B. Transactions improve database performance.
- C. Transactions are required by Android's SQLite implementation.
- D. Transactions simplify database code

**Đáp án: A**

Liên hệ Flutter: `sqflite` có `db.transaction((txn) async { ... })`; nguyên lý atomicity giống nhau.

## 3. REST API / HTTP (khái niệm URL)

### PRM392 SU25 FE - Câu 55 (trùng SP25 FE - Câu 58)
What is the difference between @Path and @Query annotations in Retrofit?

- A. @Path is used to insert values into the URL path, while @Query is used to add parameters to the URL's query string.
- B. @Path encrypts data before sending, whereas @Query sends data in plain text.
- C. @Path is used for POST requests, and @Query is used for GET requests.
- D. @Path and @Query serve the same purpose and can be used interchangeably

**Đáp án: A**

Liên hệ Flutter: tên annotation là của Retrofit, nhưng ý hỏi là khác biệt giữa tham số trong đường dẫn (`/books/5`) và query string (`/books?page=2`), áp dụng y hệt khi gọi API bằng `http` hoặc `dio` (`Uri.parse('$base/books/$id')` so với `queryParameters`). Vì vậy giữ lại.

## 4. Kiến trúc (MVC/MVVM/MVP, tách UI và logic)

### PRM392 SU25 FE - Câu 51 (cũng thuộc mục 5 Testing)
Why might MVP be preferred over MVC in Android development?

- A. MVP allows for easier unit testing by decoupling the View and the Model through the Presenter
- B. MVP is officially recommended by Google
- C. MVP supports asynchronous data loading natively
- D. MVP is simpler and requires less code

**Đáp án: A**

Liên hệ Flutter: tách logic ra khỏi widget (ví dụ class `Validators` riêng) thì viết unit test không cần dựng UI.

### PRM392 SU25 FE - Câu 52
Consider the following code (class LoginController with LoginView view, LoginModel model; performLogin(username, password) calls model.isValidUser(...) then view.showLoginSuccess() or view.showLoginError()). What is its purpose within an MVC architecture?

- A. The Controller handles user input and updates the View based on the Model's data
- B. The Controller directly updates the Model
- C. The View handles the business logic
- D. The Model updates the View directly

**Đáp án: A**

Liên hệ Flutter: vai trò Controller tương ứng với lớp xử lý sự kiện (controller/notifier) nằm giữa widget và model.

### PRM392 SU25 FE - Câu 54 (cũng thuộc mục 8 Cập nhật UI)
Which role does the ViewModel play in the MVVM architecture?

- A. The ViewModel manages the UI state and interacts with the Model.
- B. The ViewModel directly manipulates the View's UI elements.
- C. The ViewModel handles user input events.
- D. The ViewModel is responsible for data persistence.

**Đáp án: A**

Liên hệ Flutter: `ChangeNotifier`/`Provider`/`Riverpod Notifier` giữ state, gọi `notifyListeners()` để widget tự build lại.

### PRM392 SP25 FE - Câu 53
Which method should be avoided for handling business logic in MVC architecture?

- A. View
- B. Model
- C. Controller
- D. Presenter

**Đáp án: A**

Liên hệ Flutter: không đặt business logic trong `build()` của widget.

### PRM392 SP25 FE - Câu 54
Which of the following is a key difference between the MVC and MVP architectural patterns?

- A. In MVC, the Controller updates the View directly, while in MVP, the View is updated through the Presenter using interfaces.
- B. MVC does not support user input directly, while MVP is designed to handle user input through the Presenter.
- C. In MVC, the Model updates the View directly, while in MVP, the Model updates the View through the Presenter.
- D. MVC is used exclusively for web applications, while MVP is used for both web and mobile applications.

**Đáp án: A**

## 5. Testing

Chỉ có SU25 FE - Câu 51 (MVP giúp unit test dễ hơn), đã in ở mục 4.

## 6. SDK, emulator

### PRM392 SU25 FE - Câu 37
What is the purpose of an emulator in Android development?

- A. To test the app on real devices only.
- B. To simulate an Android device environment for testing and debugging.
- C. To compile the app's code.
- D. To deploy the app to a Google Play Store.

**Đáp án: B**

Liên hệ Flutter: `flutter emulators`, `flutter run` vẫn chạy trên Android emulator.

### PRM392 SP25 FE - Câu 37
What is the primary purpose of the Android Software Development Kit (SDK)?

- A. To provide pre-built applications for Android devices
- B. To offer a set of tools and libraries for developing Android apps.
- C. To manage the Android operating system updates.
- D. To simulate Android hardware for testing purposes.

**Đáp án: B**

Liên hệ Flutter: Flutter cần Android SDK để build ra Android (`flutter doctor` kiểm tra), và khái niệm "SDK = bộ công cụ + thư viện" giống với Flutter SDK. Giữ lại dù file gợi ý ban đầu định loại.

## 7. Form / nhập liệu

Không có câu nào trong hai đề này.

## 8. Cập nhật UI khi dữ liệu đổi

Chỉ có SU25 FE - Câu 54 (vai trò ViewModel trong MVVM), đã in ở mục 4.

---

## Các câu bị loại và lý do

| Câu | Nội dung | Lý do loại |
|---|---|---|
| SP25 49 | `pref.getString("key", "default")` | Cú pháp Java Android; Flutter dùng `prefs.getString('key') ?? 'default'` |
| SU25 2 | SQLite vs Content Provider | Content Provider là thành phần riêng của Android |
| SU25 47 | Lớp SQLiteDatabase để chạy câu insert | API Android (SQLiteDatabase/ContentValues) |
| SU25 50 | Override onCreate/onUpgrade của SQLiteOpenHelper | API Android (sqflite dùng tham số `onCreate`/`onUpgrade` của `openDatabase`, khác cách hỏi) |
| SP25 51 | Đọc cột bằng Cursor | API Cursor của Android, code Java |
| SP25 52 | Transaction | Không loại về nội dung, chỉ là bản trùng của SU25 48 |
| SU25 56 | Annotation @Body của Retrofit | Thư viện Retrofit, Flutter không dùng annotation này |
| SU25 58 | Tạo instance Retrofit bằng Builder | Code Java Retrofit |
| SP25 57 | Tạo instance Retrofit (trùng SU25 58) | Code Java Retrofit |
| SP25 58 | @Path vs @Query | Không loại về nội dung, chỉ là bản trùng của SU25 55 |
| SU25 53 | Activity đóng vai Controller | Activity là lớp riêng của Android |
| SU25 33 | IDE cho Android (Android Studio) | Kiến thức công cụ Android, không thuộc PRM393 |
| SU25 36 | 6 bước phát triển app (Java, Android Studio, APK) | Quy trình gắn với Java/Android Studio |
| SP25 35 | File build.gradle cấp project | Cấu hình Gradle Android; Flutter quản lý bằng `pubspec.yaml` |
| SU25 42 / SP25 42 | ImageView trong onBindViewHolder của RecyclerView (trùng nhau) | Widget và adapter riêng của Android; Flutter dùng `ListView.builder` + `Image` |
