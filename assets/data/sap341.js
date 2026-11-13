// Bộ thẻ có sẵn: SAP341, sinh từ scripts/src/SAP341_*.md bằng scripts/gen-sap341.mjs.
// Mặt trước: câu hỏi kèm các phương án. Mặt sau: đáp án. Được thêm một lần vào dữ liệu người dùng (store.js).
(window.App = window.App || {}).PACKS = (window.App.PACKS || []).concat(
{
 "id": "sap341-v1",
 "subject": {
  "name": "SAP341",
  "description": "SAP341 · Đề FA2023 B10W RE, 50 câu theo mảng kiến thức",
  "icon": "code",
  "color": "#a3e635"
 },
 "sets": [
  {
   "title": "Mảng 1: Nhập môn ABAP và SAP NetWeaver",
   "cards": [
    [
     "Câu 1. What is a unique feature of ABAP Objects compared to other object-oriented languages? (Choose 1 answer)\n\nA. Strict type checking\nB. Support for multiple inheritance\nC. Dynamically-typed variables\nD. Integration with SAP systems",
     "D. Integration with SAP systems"
    ],
    [
     "Câu 3. What does ABAP stand for? (Choose 1 answer)\n\nA. Advanced Business Application Programming\nB. None of the others\nC. Advanced Business Analysis Process\nD. Application Business Advanced Programming",
     "A. Advanced Business Application Programming"
    ],
    [
     "Câu 8. Which of the following is a true statement about ABAP? (Choose 1 answer)\n\nA. It is a procedural language.\nB. It supports both procedural and object-oriented programming.\nC. It is an object-oriented language.\nD. None of the others.",
     "B. It supports both procedural and object-oriented programming."
    ],
    [
     "Câu 19. In what forms does all ABAP code exist in the database? (Choose 1 answer)\n\nA. Binary code and generated code\nB. Source code and generated code\nC. Source code and bytecode\nD. Binary code and source code",
     "B. Source code and generated code\n\nGhi chú: 1 bình luận chọn C; các bình luận còn lại chọn B."
    ],
    [
     "Câu 21. Which of the following is a key feature of the SAP GUI for HTML? (Choose 1 answer)\n\nA. It allows access to the SAP system through a web browser.\nB. It supports only a limited set of SAP transactions.\nC. It requires the installation of additional software on the client machine.\nD. It provides offline access to the SAP system.",
     "A. It allows access to the SAP system through a web browser."
    ],
    [
     "Câu 23. What is the role of ABAP in SAP Netweaver? (Choose 1 answer)\n\nA. It is a type of operating system\nB. It is a programming language\nC. It is a runtime\nD. It is a type of database",
     "B. It is a programming language"
    ],
    [
     "Câu 34. Which data type is used for floating-point numbers in ABAP? (Choose 1 answer)\n\nA. INT8\nB. F\nC. P\nD. I",
     "B. F"
    ],
    [
     "Câu 35. What is SAP Netweaver? (Choose 1 answer)\n\nA. A type of database\nB. A platform to support various SAP applications\nC. A programming language\nD. A type of operating system",
     "B. A platform to support various SAP applications"
    ],
    [
     "Câu 40. What is the keyword used to declare data in ABAP? (Choose 1 answer)\n\nA. None of the others\nB. DATA\nC. DEFINE\nD. DECLARE",
     "B. DATA"
    ]
   ],
   "description": "Đề SAP341 FA2023 B10W RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức."
  },
  {
   "title": "Mảng 2: Môi trường và quản lý phát triển",
   "cards": [
    [
     "Câu 10. What is the purpose of activating your code in SAP? (Choose 1 answer)\n\nA. None of the others\nB. To lock the code for editing\nC. To make the code available for execution\nD. To delete the code",
     "C. To make the code available for execution"
    ],
    [
     "Câu 12. Typically, the developer namespaces begin with the letter: (Choose 1 answer)\n\nA. Y or Z\nB. A to X\nC. None of the others\nD. A to Z",
     "A. Y or Z"
    ],
    [
     "Câu 16. What is the purpose of creating your own package in SAP? (Choose 1 answer)\n\nA. To delete your developments\nB. To lock your developments for editing\nC. None of the others\nD. To group your developments",
     "D. To group your developments"
    ],
    [
     "Câu 18. How can you enter a transaction code in the SAP GUI command line? (Choose 1 answer)\n\nA. By typing the transaction code directly into the command field.\nB. By navigating through the SAP menu structure.\nC. By selecting the transaction from the SAP Easy Access menu.\nD. By clicking on the corresponding icon in the SAP GUI toolbar.",
     "A. By typing the transaction code directly into the command field.\n\nGhi chú: 1 bình luận (bị phản đối) chọn B; còn lại chọn A."
    ],
    [
     "Câu 32. What does Eclipse need to pull the program code? (Choose 1 answer)\n\nA. SAP GUI for Windows\nB. A connection to the SAP system\nC. Java Runtime Environment\nD. SAP system access data",
     "B. A connection to the SAP system"
    ],
    [
     "Câu 36. What transactions can be used to release a transport request? (Choose 1 answer)\n\nA. SE09 or SE10\nB. None of the others\nC. SE01 or SE02\nD. SE11 or SE12",
     "A. SE09 or SE10"
    ],
    [
     "Câu 39. What is a transport request? (Choose 1 answer)\n\nA. A tool for developing new SAP systems\nB. A tool for monitoring the performance of SAP systems\nC. A package which is used to transfer data from one SAP installation to another\nD. A tool for managing the database of SAP systems",
     "C. A package which is used to transfer data from one SAP installation to another"
    ],
    [
     "Câu 47. What is the primary purpose of the SE16 transaction code in ABAP? (Choose 1 answer)\n\nA. To debug ABAP code.\nB. To transport objects between SAP systems.\nC. To create a new ABAP program.\nD. To display/view data in database tables.",
     "D. To display/view data in database tables."
    ],
    [
     "Câu 48. What happens when a task is released to the related transport request? (Choose 1 answer)\n\nA. None of the others\nB. The task is deleted\nC. The recorded entries of the task are copied into the object list of the transport request\nD. The task is locked for editing",
     "C. The recorded entries of the task are copied into the object list of the transport request"
    ]
   ],
   "description": "Đề SAP341 FA2023 B10W RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức."
  },
  {
   "title": "Mảng 3: ABAP Data Dictionary",
   "cards": [
    [
     "Câu 6. What can be assigned to data types in the data dictionary? (Choose 1 answer)\n\nA. Help texts and explanations in different languages\nB. Functions\nC. Values\nD. Programs",
     "A. Help texts and explanations in different languages"
    ],
    [
     "Câu 14. What do tables and views from the ABAP dictionary represent? (Choose 1 answer)\n\nA. Tables and views from the database\nB. Tables and views from the program\nC. Tables and views from the operating system\nD. Tables and views from the user interface",
     "A. Tables and views from the database"
    ],
    [
     "Câu 38. What is the purpose of a data dictionary in ABAP programming? (Choose 1 answer)\n\nA. To handle user interfaces\nB. To manage database operations\nC. To serve as a global directory for data types\nD. To store program code",
     "C. To serve as a global directory for data types"
    ]
   ],
   "description": "Đề SAP341 FA2023 B10W RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức."
  },
  {
   "title": "Mảng 4: Lập trình ABAP cơ bản",
   "cards": [
    [
     "Câu 2. What is the main advantage of using Function Modules? (Choose 1 answer)\n\nA. They are used to create user interfaces\nB. They allow for code reuse and encapsulation\nC. They are used to handle exceptions\nD. They can be used to create loops",
     "B. They allow for code reuse and encapsulation"
    ],
    [
     "Câu 15. What is the Dynpro number for selection screens? (Choose 1 answer)\n\nA. 500\nB. 100\nC. 2000\nD. 1000",
     "D. 1000"
    ],
    [
     "Câu 17. What is the purpose of Includes in ABAP? (Choose 1 answer)\n\nA. To manage database connections\nB. To handle exceptions\nC. To create user interfaces\nD. To create reusable code blocks",
     "D. To create reusable code blocks"
    ],
    [
     "Câu 43. What is the purpose of the Process After Input (PAI) in a Dynpro? (Choose 1 answer)\n\nA. It is triggered when the program starts\nB. It is triggered when the program ends\nC. It is triggered after the user input\nD. It is triggered before the screen is displayed",
     "C. It is triggered after the user input"
    ]
   ],
   "description": "Đề SAP341 FA2023 B10W RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức."
  },
  {
   "title": "Mảng 5: OOP trong ABAP",
   "cards": [
    [
     "Câu 22. How can you achieve encapsulation in ABAP Objects? (Choose 1 answer)\n\nA. By using inherited methods\nB. By using static methods\nC. By using private attributes and methods\nD. By using polymorphism",
     "C. By using private attributes and methods"
    ],
    [
     "Câu 27. Which keyword is used to declare a class in ABAP Objects? (Choose 1 answer)\n\nA. FUNCTION\nB. CLASS\nC. METHOD\nD. INTERFACE",
     "B. CLASS"
    ],
    [
     "Câu 30. In ABAP Objects, which concept is used for persistence and database access compared to other object-oriented languages? (Choose 1 answer)\n\nA. Data Dictionary\nB. Objects\nC. Interfaces\nD. Classes",
     "A. Data Dictionary"
    ]
   ],
   "description": "Đề SAP341 FA2023 B10W RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức."
  },
  {
   "title": "Mảng 6: Exception và Lock Object",
   "cards": [
    [
     "Câu 7. What is the purpose of exception handling in ABAP? (Choose 1 answer)\n\nA. To prevent exceptions from occurring in the first place\nB. To display error messages to the user\nC. To gracefully handle and recover from runtime errors\nD. To ignore any errors that occur during program execution",
     "C. To gracefully handle and recover from runtime errors"
    ],
    [
     "Câu 11. What is the purpose of an exclusive lock in SAP? (Choose 1 answer)\n\nA. To allow other transactions to read the locked data concurrently\nB. To prevent other transactions from modifying the locked data\nC. To allow other transactions to modify the locked data concurrently\nD. To prevent other transactions from reading the locked data",
     "B. To prevent other transactions from modifying the locked data"
    ],
    [
     "Câu 13. What is the purpose of CX_NO_CHECK exception class? (Choose 1 answer)\n\nA. It is raised when a syntax error occurs during static program checks\nB. It is raised to suppress all runtime checks\nC. It is raised when a runtime error occurs during program execution",
     "C. It is raised when a runtime error occurs during program execution\n\nGhi chú: 1 bình luận (bị phản đối) chọn B; các bình luận còn lại chọn C (CX_NO_CHECK → runtime error)."
    ],
    [
     "Câu 26. What happens when an exception is raised in ABAP and there is no corresponding handler for it? (Choose 1 answer)\n\nA. The exception is ignored and program execution continues\nB. The program terminates abruptly\nC. The program enters debug mode\nD. An error message is displayed to the user",
     "B. The program terminates abruptly"
    ],
    [
     "Câu 41. What is the purpose of the TRY block in ABAP? (Choose 1 answer)\n\nA. To define a section of code where exceptions may occur\nB. To define a section of code that is always executed regardless of exceptions\nC. To catch exceptions that are raised in the program\nD. To handle runtime errors that may occur during program execution",
     "A. To define a section of code where exceptions may occur"
    ]
   ],
   "description": "Đề SAP341 FA2023 B10W RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức."
  },
  {
   "title": "Mảng 7: OData và REST",
   "cards": [
    [
     "Câu 4. The Model Provider Class (MPC) supports which OData operations for consuming data? (Choose 1 answer)\n\nA. Delete\nB. Update\nC. All of the others\nD. Read\nE. Create",
     "C. All of the others"
    ],
    [
     "Câu 5. The Model Provider Class (MPC) is responsible for: (Choose 1 answer)\n\nA. Creating OData services\nB. Validating OData requests\nC. Handling OData service metadata\nD. Consuming OData services",
     "C. Handling OData service metadata"
    ],
    [
     "Câu 20. In SAP, OData services are typically implemented using: (Choose 1 answer)\n\nA. Python\nB. ABAP\nC. C++\nD. Java",
     "B. ABAP"
    ],
    [
     "Câu 33. What does OData stand for? (Choose 1 answer)\n\nA. Open Data Protocol\nB. Object Data Protocol\nC. Ordered Data Protocol\nD. Organized Data Protocol",
     "A. Open Data Protocol"
    ],
    [
     "Câu 44. REST is an architectural style that emphasizes: (Choose 1 answer)\n\nA. Simple object serialization\nB. Stateless communication\nC. Stateful communication\nD. Complex data transformations",
     "B. Stateless communication"
    ],
    [
     "Câu 46. What does REST stand for? (Choose 1 answer)\n\nA. Representational State Transfer\nB. Representational Service Transfer\nC. Responsive State Transfer\nD. Remote State Transfer",
     "A. Representational State Transfer"
    ]
   ],
   "description": "Đề SAP341 FA2023 B10W RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức."
  },
  {
   "title": "Mảng 8: SAPUI5, Fiori và Analytics",
   "cards": [
    [
     "Câu 9. Which UI control is commonly used to display simple charts in Analytical App Development? (Choose 1 answer)\n\nA. Chart control\nB. ALV Grid control\nC. Table control\nD. Smart Table control",
     "A. Chart control"
    ],
    [
     "Câu 24. Which technology is used for designing the structure and layout of web pages? (Choose 1 answer)\n\nA. ABAP\nB. HTML5\nC. JavaScript\nD. CSS",
     "B. HTML5"
    ],
    [
     "Câu 25. What type of applications can be developed using SAPUI5? (Choose 1 answer)\n\nA. Mobile applications only.\nB. Desktop applications only.\nC. Cross-platform web and mobile applications.\nD. Web applications only.",
     "C. Cross-platform web and mobile applications."
    ],
    [
     "Câu 28. What is the purpose of a SAPUI5 component? (Choose 1 answer)\n\nA. Define routing configurations\nB. Manage user authentication\nC. Handle data binding between model and view\nD. Separate and encapsulate reusable parts of an application",
     "D. Separate and encapsulate reusable parts of an application"
    ],
    [
     "Câu 29. What is SAP Fiori? (Choose 1 answer)\n\nA. An application framework\nB. A design principle\nC. A programming language\nD. An ERP system",
     "B. A design principle\n\nGhi chú: đa số bình luận chọn B (một bình luận chọn A; một bình luận ghi \"nếu chọn 2 thì AB\")."
    ],
    [
     "Câu 31. Which programming language is used for SAPUI5 development? (Choose 1 answer)\n\nA. Java\nB. C#\nC. JavaScript\nD. ABAP",
     "C. JavaScript"
    ],
    [
     "Câu 37. In the MVC pattern of SAPUI5, which component is responsible for capturing user interactions and updating the model? (Choose 1 answer)\n\nA. View\nB. Component\nC. Controller\nD. Model",
     "C. Controller"
    ],
    [
     "Câu 42. What is the goal to create Analytical App Development? (Choose 1 answer)\n\nA. Web services\nB. Desktop applications\nC. Analytical reports and dashboards\nD. Mobile applications",
     "C. Analytical reports and dashboards"
    ],
    [
     "Câu 45. What is routing in SAPUI5? (Choose 1 answer)\n\nA. The process of defining access control rules for different user roles\nB. The process of mapping URLs to different views in an application\nC. The process of defining data binding between models and views\nD. The process of managing user sessions and authentication",
     "B. The process of mapping URLs to different views in an application"
    ],
    [
     "Câu 49. What role does SAPUI5 play in Fiori apps? (Choose 1 answer)\n\nA. SAPUI5 is a design framework used to create the visual elements in Fiori apps\nB. SAPUI5 is a separate component that is not directly related to Fiori apps\nC. SAPUI5 is a programming language used to implement the business logic in Fiori apps\nD. SAPUI5 is the underlying technology used to develop Fiori apps",
     "D. SAPUI5 is the underlying technology used to develop Fiori apps\n\nGhi chú: 1 bình luận ghi \"A cũng không sai nhưng D là đúng nhất\"; các bình luận khác chọn D."
    ],
    [
     "Câu 50. Which of the following is true about an anonymous function in JavaScript? (Choose 1 answer)\n\nA. It cannot accept parameters\nB. It cannot return a value\nC. It can be used as a callback function\nD. It cannot be assigned to a variable",
     "C. It can be used as a callback function"
    ]
   ],
   "description": "Đề SAP341 FA2023 B10W RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức."
  }
 ]
},
{
 "id": "sap341-full-v1",
 "extends": "sap341-v1",
 "subject": {
  "name": "SAP341",
  "description": "SAP341 · Đề FA2023 B10W RE, 50 câu theo mảng kiến thức",
  "icon": "code",
  "color": "#a3e635"
 },
 "sets": [
  {
   "title": "Đề FA2023 B10W RE · Tổng hợp 50 câu",
   "description": "Cả đề SAP341 FA2023 B10W RE, câu 1–50 không chia mảng · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 1. What is a unique feature of ABAP Objects compared to other object-oriented languages? (Choose 1 answer)\n\nA. Strict type checking\nB. Support for multiple inheritance\nC. Dynamically-typed variables\nD. Integration with SAP systems",
     "D. Integration with SAP systems"
    ],
    [
     "Câu 2. What is the main advantage of using Function Modules? (Choose 1 answer)\n\nA. They are used to create user interfaces\nB. They allow for code reuse and encapsulation\nC. They are used to handle exceptions\nD. They can be used to create loops",
     "B. They allow for code reuse and encapsulation"
    ],
    [
     "Câu 3. What does ABAP stand for? (Choose 1 answer)\n\nA. Advanced Business Application Programming\nB. None of the others\nC. Advanced Business Analysis Process\nD. Application Business Advanced Programming",
     "A. Advanced Business Application Programming"
    ],
    [
     "Câu 4. The Model Provider Class (MPC) supports which OData operations for consuming data? (Choose 1 answer)\n\nA. Delete\nB. Update\nC. All of the others\nD. Read\nE. Create",
     "C. All of the others"
    ],
    [
     "Câu 5. The Model Provider Class (MPC) is responsible for: (Choose 1 answer)\n\nA. Creating OData services\nB. Validating OData requests\nC. Handling OData service metadata\nD. Consuming OData services",
     "C. Handling OData service metadata"
    ],
    [
     "Câu 6. What can be assigned to data types in the data dictionary? (Choose 1 answer)\n\nA. Help texts and explanations in different languages\nB. Functions\nC. Values\nD. Programs",
     "A. Help texts and explanations in different languages"
    ],
    [
     "Câu 7. What is the purpose of exception handling in ABAP? (Choose 1 answer)\n\nA. To prevent exceptions from occurring in the first place\nB. To display error messages to the user\nC. To gracefully handle and recover from runtime errors\nD. To ignore any errors that occur during program execution",
     "C. To gracefully handle and recover from runtime errors"
    ],
    [
     "Câu 8. Which of the following is a true statement about ABAP? (Choose 1 answer)\n\nA. It is a procedural language.\nB. It supports both procedural and object-oriented programming.\nC. It is an object-oriented language.\nD. None of the others.",
     "B. It supports both procedural and object-oriented programming."
    ],
    [
     "Câu 9. Which UI control is commonly used to display simple charts in Analytical App Development? (Choose 1 answer)\n\nA. Chart control\nB. ALV Grid control\nC. Table control\nD. Smart Table control",
     "A. Chart control"
    ],
    [
     "Câu 10. What is the purpose of activating your code in SAP? (Choose 1 answer)\n\nA. None of the others\nB. To lock the code for editing\nC. To make the code available for execution\nD. To delete the code",
     "C. To make the code available for execution"
    ],
    [
     "Câu 11. What is the purpose of an exclusive lock in SAP? (Choose 1 answer)\n\nA. To allow other transactions to read the locked data concurrently\nB. To prevent other transactions from modifying the locked data\nC. To allow other transactions to modify the locked data concurrently\nD. To prevent other transactions from reading the locked data",
     "B. To prevent other transactions from modifying the locked data"
    ],
    [
     "Câu 12. Typically, the developer namespaces begin with the letter: (Choose 1 answer)\n\nA. Y or Z\nB. A to X\nC. None of the others\nD. A to Z",
     "A. Y or Z"
    ],
    [
     "Câu 13. What is the purpose of CX_NO_CHECK exception class? (Choose 1 answer)\n\nA. It is raised when a syntax error occurs during static program checks\nB. It is raised to suppress all runtime checks\nC. It is raised when a runtime error occurs during program execution",
     "C. It is raised when a runtime error occurs during program execution\n\nGhi chú: 1 bình luận (bị phản đối) chọn B; các bình luận còn lại chọn C (CX_NO_CHECK → runtime error)."
    ],
    [
     "Câu 14. What do tables and views from the ABAP dictionary represent? (Choose 1 answer)\n\nA. Tables and views from the database\nB. Tables and views from the program\nC. Tables and views from the operating system\nD. Tables and views from the user interface",
     "A. Tables and views from the database"
    ],
    [
     "Câu 15. What is the Dynpro number for selection screens? (Choose 1 answer)\n\nA. 500\nB. 100\nC. 2000\nD. 1000",
     "D. 1000"
    ],
    [
     "Câu 16. What is the purpose of creating your own package in SAP? (Choose 1 answer)\n\nA. To delete your developments\nB. To lock your developments for editing\nC. None of the others\nD. To group your developments",
     "D. To group your developments"
    ],
    [
     "Câu 17. What is the purpose of Includes in ABAP? (Choose 1 answer)\n\nA. To manage database connections\nB. To handle exceptions\nC. To create user interfaces\nD. To create reusable code blocks",
     "D. To create reusable code blocks"
    ],
    [
     "Câu 18. How can you enter a transaction code in the SAP GUI command line? (Choose 1 answer)\n\nA. By typing the transaction code directly into the command field.\nB. By navigating through the SAP menu structure.\nC. By selecting the transaction from the SAP Easy Access menu.\nD. By clicking on the corresponding icon in the SAP GUI toolbar.",
     "A. By typing the transaction code directly into the command field.\n\nGhi chú: 1 bình luận (bị phản đối) chọn B; còn lại chọn A."
    ],
    [
     "Câu 19. In what forms does all ABAP code exist in the database? (Choose 1 answer)\n\nA. Binary code and generated code\nB. Source code and generated code\nC. Source code and bytecode\nD. Binary code and source code",
     "B. Source code and generated code\n\nGhi chú: 1 bình luận chọn C; các bình luận còn lại chọn B."
    ],
    [
     "Câu 20. In SAP, OData services are typically implemented using: (Choose 1 answer)\n\nA. Python\nB. ABAP\nC. C++\nD. Java",
     "B. ABAP"
    ],
    [
     "Câu 21. Which of the following is a key feature of the SAP GUI for HTML? (Choose 1 answer)\n\nA. It allows access to the SAP system through a web browser.\nB. It supports only a limited set of SAP transactions.\nC. It requires the installation of additional software on the client machine.\nD. It provides offline access to the SAP system.",
     "A. It allows access to the SAP system through a web browser."
    ],
    [
     "Câu 22. How can you achieve encapsulation in ABAP Objects? (Choose 1 answer)\n\nA. By using inherited methods\nB. By using static methods\nC. By using private attributes and methods\nD. By using polymorphism",
     "C. By using private attributes and methods"
    ],
    [
     "Câu 23. What is the role of ABAP in SAP Netweaver? (Choose 1 answer)\n\nA. It is a type of operating system\nB. It is a programming language\nC. It is a runtime\nD. It is a type of database",
     "B. It is a programming language"
    ],
    [
     "Câu 24. Which technology is used for designing the structure and layout of web pages? (Choose 1 answer)\n\nA. ABAP\nB. HTML5\nC. JavaScript\nD. CSS",
     "B. HTML5"
    ],
    [
     "Câu 25. What type of applications can be developed using SAPUI5? (Choose 1 answer)\n\nA. Mobile applications only.\nB. Desktop applications only.\nC. Cross-platform web and mobile applications.\nD. Web applications only.",
     "C. Cross-platform web and mobile applications."
    ],
    [
     "Câu 26. What happens when an exception is raised in ABAP and there is no corresponding handler for it? (Choose 1 answer)\n\nA. The exception is ignored and program execution continues\nB. The program terminates abruptly\nC. The program enters debug mode\nD. An error message is displayed to the user",
     "B. The program terminates abruptly"
    ],
    [
     "Câu 27. Which keyword is used to declare a class in ABAP Objects? (Choose 1 answer)\n\nA. FUNCTION\nB. CLASS\nC. METHOD\nD. INTERFACE",
     "B. CLASS"
    ],
    [
     "Câu 28. What is the purpose of a SAPUI5 component? (Choose 1 answer)\n\nA. Define routing configurations\nB. Manage user authentication\nC. Handle data binding between model and view\nD. Separate and encapsulate reusable parts of an application",
     "D. Separate and encapsulate reusable parts of an application"
    ],
    [
     "Câu 29. What is SAP Fiori? (Choose 1 answer)\n\nA. An application framework\nB. A design principle\nC. A programming language\nD. An ERP system",
     "B. A design principle\n\nGhi chú: đa số bình luận chọn B (một bình luận chọn A; một bình luận ghi \"nếu chọn 2 thì AB\")."
    ],
    [
     "Câu 30. In ABAP Objects, which concept is used for persistence and database access compared to other object-oriented languages? (Choose 1 answer)\n\nA. Data Dictionary\nB. Objects\nC. Interfaces\nD. Classes",
     "A. Data Dictionary"
    ],
    [
     "Câu 31. Which programming language is used for SAPUI5 development? (Choose 1 answer)\n\nA. Java\nB. C#\nC. JavaScript\nD. ABAP",
     "C. JavaScript"
    ],
    [
     "Câu 32. What does Eclipse need to pull the program code? (Choose 1 answer)\n\nA. SAP GUI for Windows\nB. A connection to the SAP system\nC. Java Runtime Environment\nD. SAP system access data",
     "B. A connection to the SAP system"
    ],
    [
     "Câu 33. What does OData stand for? (Choose 1 answer)\n\nA. Open Data Protocol\nB. Object Data Protocol\nC. Ordered Data Protocol\nD. Organized Data Protocol",
     "A. Open Data Protocol"
    ],
    [
     "Câu 34. Which data type is used for floating-point numbers in ABAP? (Choose 1 answer)\n\nA. INT8\nB. F\nC. P\nD. I",
     "B. F"
    ],
    [
     "Câu 35. What is SAP Netweaver? (Choose 1 answer)\n\nA. A type of database\nB. A platform to support various SAP applications\nC. A programming language\nD. A type of operating system",
     "B. A platform to support various SAP applications"
    ],
    [
     "Câu 36. What transactions can be used to release a transport request? (Choose 1 answer)\n\nA. SE09 or SE10\nB. None of the others\nC. SE01 or SE02\nD. SE11 or SE12",
     "A. SE09 or SE10"
    ],
    [
     "Câu 37. In the MVC pattern of SAPUI5, which component is responsible for capturing user interactions and updating the model? (Choose 1 answer)\n\nA. View\nB. Component\nC. Controller\nD. Model",
     "C. Controller"
    ],
    [
     "Câu 38. What is the purpose of a data dictionary in ABAP programming? (Choose 1 answer)\n\nA. To handle user interfaces\nB. To manage database operations\nC. To serve as a global directory for data types\nD. To store program code",
     "C. To serve as a global directory for data types"
    ],
    [
     "Câu 39. What is a transport request? (Choose 1 answer)\n\nA. A tool for developing new SAP systems\nB. A tool for monitoring the performance of SAP systems\nC. A package which is used to transfer data from one SAP installation to another\nD. A tool for managing the database of SAP systems",
     "C. A package which is used to transfer data from one SAP installation to another"
    ],
    [
     "Câu 40. What is the keyword used to declare data in ABAP? (Choose 1 answer)\n\nA. None of the others\nB. DATA\nC. DEFINE\nD. DECLARE",
     "B. DATA"
    ],
    [
     "Câu 41. What is the purpose of the TRY block in ABAP? (Choose 1 answer)\n\nA. To define a section of code where exceptions may occur\nB. To define a section of code that is always executed regardless of exceptions\nC. To catch exceptions that are raised in the program\nD. To handle runtime errors that may occur during program execution",
     "A. To define a section of code where exceptions may occur"
    ],
    [
     "Câu 42. What is the goal to create Analytical App Development? (Choose 1 answer)\n\nA. Web services\nB. Desktop applications\nC. Analytical reports and dashboards\nD. Mobile applications",
     "C. Analytical reports and dashboards"
    ],
    [
     "Câu 43. What is the purpose of the Process After Input (PAI) in a Dynpro? (Choose 1 answer)\n\nA. It is triggered when the program starts\nB. It is triggered when the program ends\nC. It is triggered after the user input\nD. It is triggered before the screen is displayed",
     "C. It is triggered after the user input"
    ],
    [
     "Câu 44. REST is an architectural style that emphasizes: (Choose 1 answer)\n\nA. Simple object serialization\nB. Stateless communication\nC. Stateful communication\nD. Complex data transformations",
     "B. Stateless communication"
    ],
    [
     "Câu 45. What is routing in SAPUI5? (Choose 1 answer)\n\nA. The process of defining access control rules for different user roles\nB. The process of mapping URLs to different views in an application\nC. The process of defining data binding between models and views\nD. The process of managing user sessions and authentication",
     "B. The process of mapping URLs to different views in an application"
    ],
    [
     "Câu 46. What does REST stand for? (Choose 1 answer)\n\nA. Representational State Transfer\nB. Representational Service Transfer\nC. Responsive State Transfer\nD. Remote State Transfer",
     "A. Representational State Transfer"
    ],
    [
     "Câu 47. What is the primary purpose of the SE16 transaction code in ABAP? (Choose 1 answer)\n\nA. To debug ABAP code.\nB. To transport objects between SAP systems.\nC. To create a new ABAP program.\nD. To display/view data in database tables.",
     "D. To display/view data in database tables."
    ],
    [
     "Câu 48. What happens when a task is released to the related transport request? (Choose 1 answer)\n\nA. None of the others\nB. The task is deleted\nC. The recorded entries of the task are copied into the object list of the transport request\nD. The task is locked for editing",
     "C. The recorded entries of the task are copied into the object list of the transport request"
    ],
    [
     "Câu 49. What role does SAPUI5 play in Fiori apps? (Choose 1 answer)\n\nA. SAPUI5 is a design framework used to create the visual elements in Fiori apps\nB. SAPUI5 is a separate component that is not directly related to Fiori apps\nC. SAPUI5 is a programming language used to implement the business logic in Fiori apps\nD. SAPUI5 is the underlying technology used to develop Fiori apps",
     "D. SAPUI5 is the underlying technology used to develop Fiori apps\n\nGhi chú: 1 bình luận ghi \"A cũng không sai nhưng D là đúng nhất\"; các bình luận khác chọn D."
    ],
    [
     "Câu 50. Which of the following is true about an anonymous function in JavaScript? (Choose 1 answer)\n\nA. It cannot accept parameters\nB. It cannot return a value\nC. It can be used as a callback function\nD. It cannot be assigned to a variable",
     "C. It can be used as a callback function"
    ]
   ]
  }
 ]
},
{
 "id": "sap341-su24fe-v1",
 "extends": "sap341-v1",
 "subject": {
  "name": "SAP341",
  "description": "SAP341 · Đề FA2023 B10W RE, 50 câu theo mảng kiến thức",
  "icon": "code",
  "color": "#a3e635"
 },
 "sets": [
  {
   "into": "Mảng 1: Nhập môn ABAP và SAP NetWeaver",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 20. What is the purpose of the Favorites folder in SAP GUI Easy Access? (Choose 1 answer)\n\nA. It provides quick access to frequently used transactions.\nB. It stores user login credentials for the SAP system.\nC. It displays a list of available SAP system connections.\nD. It allows users to customize the layout and appearance of SAP screens.",
     "A. It provides quick access to frequently used transactions."
    ],
    [
     "Câu 23. How can you customize the SAP GUI Easy Access menu? (Choose 1 answer)\n\nA. By creating a personalization variant in the SAP system.\nB. By editing the SAP GUI Easy Access XML file.\nC. By modifying the SAP system configuration settings.\nD. By installing additional software on the client machine.",
     "C. By modifying the SAP system configuration settings.\n\nGhi chú: bình luận không thống nhất. 2 bình luận cũ (AyakamiYuu, thkgaming156) chọn A; 3 bình luận mới hơn (bubucon, minh109 \"c slide nhá\", Benjamin \"c thật nhé\") chọn C. Chọn C theo các bình luận mới nhất, độ tin cậy thấp."
    ]
   ]
  },
  {
   "into": "Mảng 2: Môi trường và quản lý phát triển",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 19. Where is ABAP code developed? (Choose 1 answer)\n\nA. Online on the server\nB. Offline on the server\nC. Offline in Eclipse\nD. Online in Eclipse",
     "A. Online on the server"
    ],
    [
     "Câu 33. What is the primary benefit of adhering to namespace conventions in ABAP? (Choose 1 answer)\n\nA. Clear distinction between SAP standard and custom objects.\nB. Improved system security.\nC. Enhanced program performance.\nD. Reduced memory consumption.",
     "A. Clear distinction between SAP standard and custom objects."
    ],
    [
     "Câu 36. What is the purpose of the SAP transport system? (Choose 1 answer)\n\nA. To transfer changes made to objects in either Customizing or the Repository to other SAP systems\nB. To develop new SAP systems\nC. To manage the database of SAP systems\nD. To monitor the performance of SAP systems",
     "A. To transfer changes made to objects in either Customizing or the Repository to other SAP systems"
    ],
    [
     "Câu 37. What happens to the code when you activate your code in SAP? (Choose 1 answer)\n\nA. The code is copied to the target system\nB. The code is looked for editing\nC. The code is deleted\nD. None of the others\nE. The code is compiled and made available for execution",
     "E. The code is compiled and made available for execution"
    ],
    [
     "Câu 38. What is the purpose of releasing tasks in SAP ABAP? (Choose 1 answer)\n\nA. To make the task available for transport\nB. To delete the task\nC. To lock the task for editing\nD. None of the others",
     "A. To make the task available for transport"
    ]
   ]
  },
  {
   "into": "Mảng 3: ABAP Data Dictionary",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 17. What is a domain in the data dictionary? (Choose 1 answer)\n\nA. A reusable component that defines the technical settings of a table field\nB. A logical unit of a program\nC. A container for data elements\nD. A collection of related tables",
     "A. A reusable component that defines the technical settings of a table field"
    ],
    [
     "Câu 18. What is the transaction code to access the data dictionary? (Choose 1 answer)\n\nA. SE11\nB. SM38\nC. SE80\nD. SE38",
     "A. SE11"
    ]
   ]
  },
  {
   "into": "Mảng 4: Lập trình ABAP cơ bản",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 10. What is a BAPI in ABAP? (Choose 1 answer)\n\nA. A standardized programming interface\nB. A type of loop\nC. A user interface element\nD. A database connection",
     "A. A standardized programming interface"
    ],
    [
     "Câu 11. What is the main advantage of using BAPIs? (Choose 1 answer)\n\nA. They provide a standardized programming interface\nB. They can be used to create loops\nC. They allow for code reuse and encapsulation\nD. They can create user interfaces",
     "A. They provide a standardized programming interface"
    ],
    [
     "Câu 24. What is a Dynpro in ABAP? (Choose 1 answer)\n\nA. It's a dynamic screen that is used for user interaction.\nB. It's a dynamic program that changes during runtime.\nC. It's a dynamic database table.\nD. None of the others.",
     "A. It's a dynamic screen that is used for user interaction."
    ],
    [
     "Câu 39. What is the purpose of the PROCESS BEFORE OUTPUT in Dynpro flow logic? (Choose 1 answer)\n\nA. It is executed before sending the Dynpro screen and is used to prepare the screen, e.g. set default values\nB. It is executed every time a user interaction triggers a function code / OK code\nC. It is triggered when user selects the info help F1\nD. It is triggered when user selects the input help F4",
     "A. It is executed before sending the Dynpro screen and is used to prepare the screen, e.g. set default values"
    ],
    [
     "Câu 40. What does the PROCESS BEFORE OUTPUT in Dynpro flow logic do if it is executed before sending the Dynpro screen? (Choose 1 answer)\n\nA. It prepares the screen, e.g. set default values\nB. It triggers a function code / OK code\nC. It selects the info help F1\nD. It selects the input help F4",
     "A. It prepares the screen, e.g. set default values"
    ],
    [
     "Câu 41. How are selection screens generated in ABAP? (Choose 1 answer)\n\nA. Automatically when the keyword 'Parameters' is used in source code\nB. By using the keyword 'Select'\nC. Manually by the programmer\nD. Through a special function module",
     "A. Automatically when the keyword 'Parameters' is used in source code"
    ],
    [
     "Câu 42. What is the keyword used to define a new data type in ABAP? (Choose 1 answer)\n\nA. TYPES\nB. DEFINE\nC. DECLARE\nD. None of the others",
     "A. TYPES"
    ],
    [
     "Câu 43. Which transaction code is used to schedule ABAP programs as background jobs? (Choose 1 answer)\n\nA. SM36\nB. SM37\nC. SE80\nD. SE38",
     "A. SM36"
    ],
    [
     "Câu 44. What type of processing should long running programs always run in? (Choose 1 answer)\n\nA. Background processing\nB. Update processing\nC. Foreground processing\nD. Dialog processing",
     "A. Background processing"
    ]
   ]
  },
  {
   "into": "Mảng 5: OOP trong ABAP",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 25. In ABAP Objects, which method of a class is automatically called when an object is created? (Choose 1 answer)\n\nA. CONSTRUCTOR\nB. DESTRUCTOR\nC. INITIALIZATION\nD. INSTANCE_CONSTRUCTOR",
     "A. CONSTRUCTOR"
    ],
    [
     "Câu 28. Which access type is used to make a method accessible by external programs in ABAP Objects? (Choose 1 answer)\n\nA. PUBLIC\nB. PRIVATE\nC. PROTECTED\nD. LOCAL",
     "A. PUBLIC"
    ]
   ]
  },
  {
   "into": "Mảng 6: Exception và Lock Object",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 1. Which statement is used to handle exceptions in ABAP?\n\nA. CATCH\nB. TRY\nC. RESUME\nD. RAISE",
     "A. CATCH\n\nGhi chú: đa số bình luận chọn A, 1 bình luận (nan0nun) chọn B."
    ],
    [
     "Câu 31. What is the main advantage of using shared locks in SAP? (Choose 1 answer)\n\nA. Improved performance and concurrency\nB. Enhanced data security\nC. Increased data consistency\nD. Simplified data access",
     "A. Improved performance and concurrency"
    ],
    [
     "Câu 32. When does an exclusive lock on data get released in SAP? (Choose 1 answer)\n\nA. When the transaction is committed or rolled back\nB. When the locked data is read by another transaction\nC. When the transaction is LOsed or terminated\nD. When the locked data is modified by another transaction",
     "A. When the transaction is committed or rolled back"
    ]
   ]
  },
  {
   "into": "Mảng 7: OData và REST",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 6. OData is a protocol for building and consuming: (Choose 1 answer)\n\nA. RESTful APIs\nB. Message queues\nC. SOAP web services\nD. Database queries",
     "A. RESTful APIs"
    ]
   ]
  },
  {
   "into": "Mảng 8: SAPUI5, Fiori và Analytics",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 12. Which HTML element is used to create a table? (Choose 1 answer)\n\nA. <table>\nB. <form>\nC. <div>\nD. <body>",
     "A. <table>"
    ],
    [
     "Câu 13. Which symbol is used to represent the jQuery library in JavaScript? (Choose 1 answer)\n\nA. $\nB. #\nC. @\nD. !",
     "A. $"
    ],
    [
     "Câu 14. Which keyword is used to define a function in JavaScript? (Choose 1 answer)\n\nA. function\nB. create\nC. def\nD. method",
     "A. function"
    ],
    [
     "Câu 22. Which application type in SAP is a web-based framework for developing interactive business applications? (Choose 1 answer)\n\nA. SAPUI5\nB. Dynpro\nC. Report\nD. Business Server Page\nE. Web Dynpro",
     "A. SAPUI5"
    ],
    [
     "Câu 29. What is the main goal of SAP Fiori? (Choose 1 answer)\n\nA. To provide a user-friendly and consistent user interface for SAP applications\nB. To replace traditional SAP applications with modern web-based interfaces\nC. To automate business processes and workflows in SAP systems\nD. To enable real-time analytics and reporting in SAP HANA",
     "A. To provide a user-friendly and consistent user interface for SAP applications"
    ],
    [
     "Câu 45. How do you define a controller for a SAPUI5 view? (Choose 1 answer)\n\nA. Creating a separate JavaScript file for the controller and linking it to the view\nB. Adding the controller code directly in the view file using a script tag\nC. Using the \"controller\" property in the XML view definition\nD. Declaring a script tag with the controller code in the HTML view file",
     "A. Creating a separate JavaScript file for the controller and linking it to the view"
    ],
    [
     "Câu 47. Which component is responsible for maintaining the data and business logic in SAPUI5? (Choose 1 answer)\n\nA. Model\nB. View\nC. Controller\nD. Component",
     "A. Model\n\nGhi chú: bình luận không thống nhất. thkgaming156, Benjamin (\"đã check slide\") và nan0nun chọn A; bubucon chọn C. Về mặt MVC, Model giữ dữ liệu, nên chọn A."
    ],
    [
     "Câu 48. How can you enhance the user experience of Analytical App using Smart UI Controls? (Choose 1 answer)\n\nA. All of the others\nB. By providing responsive and adaptive layouts\nC. By allowing users to easily filter and search data\nD. By displaying charts and visualizations for data analysis",
     "A. All of the others"
    ],
    [
     "Câu 49. Which UI control is used to display tabular data in ABAP Analytical App Development? (Choose 1 answer)\n\nA. Smart Table control\nB. ALV Grid control\nC. Chart control\nD. Table control",
     "A. Smart Table control"
    ]
   ]
  },
  {
   "title": "Đề SU2024 FE · Tổng hợp 50 câu",
   "description": "Cả đề SAP341 SU2024 FE, câu 1–50 không chia mảng · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 1. Which statement is used to handle exceptions in ABAP?\n\nA. CATCH\nB. TRY\nC. RESUME\nD. RAISE",
     "A. CATCH\n\nGhi chú: đa số bình luận chọn A, 1 bình luận (nan0nun) chọn B."
    ],
    [
     "Câu 2. What happens when an exception is raised in ABAP and there is no corresponding handler for it? (Choose 1 answer)\n\nA. The program terminates abruptly\nB. The exception is ignored and program execution continues\nC. An error message is displayed to the user\nD. The program enters debug mode",
     "A. The program terminates abruptly"
    ],
    [
     "Câu 3. What is the purpose of CX_NO_CHECK exception class? (Choose 1 answer)\n\nA. It is raised to suppress all runtime checks\nB. It is raised when a syntax error occurs during static program checks\nC. It is raised when a runtime error occurs during program execution",
     "C. It is raised when a runtime error occurs during program execution"
    ],
    [
     "Câu 4. What is the purpose of exception handling in ABAP? (Choose 1 answer)\n\nA. To gracefully handle and recover from runtime errors\nB. To prevent exceptions from occurring in the first place\nC. To display error messages to the user\nD. To ignore any errors that occur during program execution",
     "A. To gracefully handle and recover from runtime errors"
    ],
    [
     "Câu 5. What does REST stand for? (Choose 1 answer)\n\nA. Representational State Transfer\nB. Responsive State Transfer\nC. Remote State Transfer\nD. Representational Service Transfer",
     "A. Representational State Transfer"
    ],
    [
     "Câu 6. OData is a protocol for building and consuming: (Choose 1 answer)\n\nA. RESTful APIs\nB. Message queues\nC. SOAP web services\nD. Database queries",
     "A. RESTful APIs"
    ],
    [
     "Câu 7. The Model Provider Class (MPC) supports which OData operations for consuming data? (Choose 1 answer)\n\nA. All of the others\nB. Read\nC. Update\nD. Create\nE. Delete",
     "A. All of the others"
    ],
    [
     "Câu 8. In SAP, OData services are typically implemented using: (Choose 1 answer)\n\nA. ABAP\nB. Java\nC. C++\nD. Python",
     "A. ABAP"
    ],
    [
     "Câu 9. What is the purpose of Includes in ABAP? (Choose 1 answer)\n\nA. To create reusable code blocks\nB. To create user interfaces\nC. To manage database connections\nD. To handle exceptions",
     "A. To create reusable code blocks"
    ],
    [
     "Câu 10. What is a BAPI in ABAP? (Choose 1 answer)\n\nA. A standardized programming interface\nB. A type of loop\nC. A user interface element\nD. A database connection",
     "A. A standardized programming interface"
    ],
    [
     "Câu 11. What is the main advantage of using BAPIs? (Choose 1 answer)\n\nA. They provide a standardized programming interface\nB. They can be used to create loops\nC. They allow for code reuse and encapsulation\nD. They can create user interfaces",
     "A. They provide a standardized programming interface"
    ],
    [
     "Câu 12. Which HTML element is used to create a table? (Choose 1 answer)\n\nA. <table>\nB. <form>\nC. <div>\nD. <body>",
     "A. <table>"
    ],
    [
     "Câu 13. Which symbol is used to represent the jQuery library in JavaScript? (Choose 1 answer)\n\nA. $\nB. #\nC. @\nD. !",
     "A. $"
    ],
    [
     "Câu 14. Which keyword is used to define a function in JavaScript? (Choose 1 answer)\n\nA. function\nB. create\nC. def\nD. method",
     "A. function"
    ],
    [
     "Câu 15. Which of the following is true about an anonymous function in JavaScript? (Choose 1 answer)\n\nA. It can be used as a callback function\nB. It cannot be assigned to a variable\nC. It cannot return a value\nD. It cannot accept parameters",
     "A. It can be used as a callback function"
    ],
    [
     "Câu 16. What is the primary purpose of the SE16 transaction code in ABAP? (Choose 1 answer)\n\nA. To display/view data in database tables.\nB. To create a new ABAP program.\nC. To transport objects between SAP systems.\nD. To debug ABAP code.",
     "A. To display/view data in database tables."
    ],
    [
     "Câu 17. What is a domain in the data dictionary? (Choose 1 answer)\n\nA. A reusable component that defines the technical settings of a table field\nB. A logical unit of a program\nC. A container for data elements\nD. A collection of related tables",
     "A. A reusable component that defines the technical settings of a table field"
    ],
    [
     "Câu 18. What is the transaction code to access the data dictionary? (Choose 1 answer)\n\nA. SE11\nB. SM38\nC. SE80\nD. SE38",
     "A. SE11"
    ],
    [
     "Câu 19. Where is ABAP code developed? (Choose 1 answer)\n\nA. Online on the server\nB. Offline on the server\nC. Offline in Eclipse\nD. Online in Eclipse",
     "A. Online on the server"
    ],
    [
     "Câu 20. What is the purpose of the Favorites folder in SAP GUI Easy Access? (Choose 1 answer)\n\nA. It provides quick access to frequently used transactions.\nB. It stores user login credentials for the SAP system.\nC. It displays a list of available SAP system connections.\nD. It allows users to customize the layout and appearance of SAP screens.",
     "A. It provides quick access to frequently used transactions."
    ],
    [
     "Câu 21. What does Eclipse need to pull the program code? (Choose 1 answer)\n\nA. A connection to the SAP system\nB. SAP GUI for Windows\nC. Java Runtime Environment\nD. SAP system access data",
     "A. A connection to the SAP system"
    ],
    [
     "Câu 22. Which application type in SAP is a web-based framework for developing interactive business applications? (Choose 1 answer)\n\nA. SAPUI5\nB. Dynpro\nC. Report\nD. Business Server Page\nE. Web Dynpro",
     "A. SAPUI5"
    ],
    [
     "Câu 23. How can you customize the SAP GUI Easy Access menu? (Choose 1 answer)\n\nA. By creating a personalization variant in the SAP system.\nB. By editing the SAP GUI Easy Access XML file.\nC. By modifying the SAP system configuration settings.\nD. By installing additional software on the client machine.",
     "C. By modifying the SAP system configuration settings.\n\nGhi chú: bình luận không thống nhất. 2 bình luận cũ (AyakamiYuu, thkgaming156) chọn A; 3 bình luận mới hơn (bubucon, minh109 \"c slide nhá\", Benjamin \"c thật nhé\") chọn C. Chọn C theo các bình luận mới nhất, độ tin cậy thấp."
    ],
    [
     "Câu 24. What is a Dynpro in ABAP? (Choose 1 answer)\n\nA. It's a dynamic screen that is used for user interaction.\nB. It's a dynamic program that changes during runtime.\nC. It's a dynamic database table.\nD. None of the others.",
     "A. It's a dynamic screen that is used for user interaction."
    ],
    [
     "Câu 25. In ABAP Objects, which method of a class is automatically called when an object is created? (Choose 1 answer)\n\nA. CONSTRUCTOR\nB. DESTRUCTOR\nC. INITIALIZATION\nD. INSTANCE_CONSTRUCTOR",
     "A. CONSTRUCTOR"
    ],
    [
     "Câu 26. What is a unique feature of ABAP Objects compared to other object-oriented languages? (Choose 1 answer)\n\nA. Integration with SAP systems\nB. Support for multiple inheritance\nC. Dynamically-typed variables\nD. Strict type checking",
     "A. Integration with SAP systems"
    ],
    [
     "Câu 27. In ABAP Objects, which concept is used for persistence and database access compared to other object-oriented languages? (Choose 1 answer)\n\nA. Data Dictionary\nB. Classes\nC. Interfaces\nD. Objects",
     "A. Data Dictionary"
    ],
    [
     "Câu 28. Which access type is used to make a method accessible by external programs in ABAP Objects? (Choose 1 answer)\n\nA. PUBLIC\nB. PRIVATE\nC. PROTECTED\nD. LOCAL",
     "A. PUBLIC"
    ],
    [
     "Câu 29. What is the main goal of SAP Fiori? (Choose 1 answer)\n\nA. To provide a user-friendly and consistent user interface for SAP applications\nB. To replace traditional SAP applications with modern web-based interfaces\nC. To automate business processes and workflows in SAP systems\nD. To enable real-time analytics and reporting in SAP HANA",
     "A. To provide a user-friendly and consistent user interface for SAP applications"
    ],
    [
     "Câu 30. What role does SAPUI5 play in Fiori apps? (Choose 1 answer)\n\nA. SAPUI5 is the underlying technology used to develop Fiori apps\nB. SAPUI5 is a design framework used to create the visual elements in Fiori apps\nC. SAPUI5 is a programming language used to implement the business logic in Fiori apps\nD. SAPUI5 is a separate component that is not directly related to Fiori apps",
     "A. SAPUI5 is the underlying technology used to develop Fiori apps"
    ],
    [
     "Câu 31. What is the main advantage of using shared locks in SAP? (Choose 1 answer)\n\nA. Improved performance and concurrency\nB. Enhanced data security\nC. Increased data consistency\nD. Simplified data access",
     "A. Improved performance and concurrency"
    ],
    [
     "Câu 32. When does an exclusive lock on data get released in SAP? (Choose 1 answer)\n\nA. When the transaction is committed or rolled back\nB. When the locked data is read by another transaction\nC. When the transaction is LOsed or terminated\nD. When the locked data is modified by another transaction",
     "A. When the transaction is committed or rolled back"
    ],
    [
     "Câu 33. What is the primary benefit of adhering to namespace conventions in ABAP? (Choose 1 answer)\n\nA. Clear distinction between SAP standard and custom objects.\nB. Improved system security.\nC. Enhanced program performance.\nD. Reduced memory consumption.",
     "A. Clear distinction between SAP standard and custom objects."
    ],
    [
     "Câu 34. What transactions can be used to release a transport request? (Choose 1 answer)\n\nA. SE09 or SE10\nB. SE01 or SE02\nC. SE11 or SE12\nD. None of the others",
     "A. SE09 or SE10"
    ],
    [
     "Câu 35. What happens when a task is released to the related transport request? (Choose 1 answer)\n\nA. The recorded entries of the task are copied into the object list of the transport request\nB. The task is locked for editing\nC. The task is deleted\nD. None of the others",
     "A. The recorded entries of the task are copied into the object list of the transport request"
    ],
    [
     "Câu 36. What is the purpose of the SAP transport system? (Choose 1 answer)\n\nA. To transfer changes made to objects in either Customizing or the Repository to other SAP systems\nB. To develop new SAP systems\nC. To manage the database of SAP systems\nD. To monitor the performance of SAP systems",
     "A. To transfer changes made to objects in either Customizing or the Repository to other SAP systems"
    ],
    [
     "Câu 37. What happens to the code when you activate your code in SAP? (Choose 1 answer)\n\nA. The code is copied to the target system\nB. The code is looked for editing\nC. The code is deleted\nD. None of the others\nE. The code is compiled and made available for execution",
     "E. The code is compiled and made available for execution"
    ],
    [
     "Câu 38. What is the purpose of releasing tasks in SAP ABAP? (Choose 1 answer)\n\nA. To make the task available for transport\nB. To delete the task\nC. To lock the task for editing\nD. None of the others",
     "A. To make the task available for transport"
    ],
    [
     "Câu 39. What is the purpose of the PROCESS BEFORE OUTPUT in Dynpro flow logic? (Choose 1 answer)\n\nA. It is executed before sending the Dynpro screen and is used to prepare the screen, e.g. set default values\nB. It is executed every time a user interaction triggers a function code / OK code\nC. It is triggered when user selects the info help F1\nD. It is triggered when user selects the input help F4",
     "A. It is executed before sending the Dynpro screen and is used to prepare the screen, e.g. set default values"
    ],
    [
     "Câu 40. What does the PROCESS BEFORE OUTPUT in Dynpro flow logic do if it is executed before sending the Dynpro screen? (Choose 1 answer)\n\nA. It prepares the screen, e.g. set default values\nB. It triggers a function code / OK code\nC. It selects the info help F1\nD. It selects the input help F4",
     "A. It prepares the screen, e.g. set default values"
    ],
    [
     "Câu 41. How are selection screens generated in ABAP? (Choose 1 answer)\n\nA. Automatically when the keyword 'Parameters' is used in source code\nB. By using the keyword 'Select'\nC. Manually by the programmer\nD. Through a special function module",
     "A. Automatically when the keyword 'Parameters' is used in source code"
    ],
    [
     "Câu 42. What is the keyword used to define a new data type in ABAP? (Choose 1 answer)\n\nA. TYPES\nB. DEFINE\nC. DECLARE\nD. None of the others",
     "A. TYPES"
    ],
    [
     "Câu 43. Which transaction code is used to schedule ABAP programs as background jobs? (Choose 1 answer)\n\nA. SM36\nB. SM37\nC. SE80\nD. SE38",
     "A. SM36"
    ],
    [
     "Câu 44. What type of processing should long running programs always run in? (Choose 1 answer)\n\nA. Background processing\nB. Update processing\nC. Foreground processing\nD. Dialog processing",
     "A. Background processing"
    ],
    [
     "Câu 45. How do you define a controller for a SAPUI5 view? (Choose 1 answer)\n\nA. Creating a separate JavaScript file for the controller and linking it to the view\nB. Adding the controller code directly in the view file using a script tag\nC. Using the \"controller\" property in the XML view definition\nD. Declaring a script tag with the controller code in the HTML view file",
     "A. Creating a separate JavaScript file for the controller and linking it to the view"
    ],
    [
     "Câu 46. Which programming language is used for SAPUI5 development? (Choose 1 answer)\n\nA. JavaScript\nB. ABAP\nC. Java\nD. C#",
     "A. JavaScript"
    ],
    [
     "Câu 47. Which component is responsible for maintaining the data and business logic in SAPUI5? (Choose 1 answer)\n\nA. Model\nB. View\nC. Controller\nD. Component",
     "A. Model\n\nGhi chú: bình luận không thống nhất. thkgaming156, Benjamin (\"đã check slide\") và nan0nun chọn A; bubucon chọn C. Về mặt MVC, Model giữ dữ liệu, nên chọn A."
    ],
    [
     "Câu 48. How can you enhance the user experience of Analytical App using Smart UI Controls? (Choose 1 answer)\n\nA. All of the others\nB. By providing responsive and adaptive layouts\nC. By allowing users to easily filter and search data\nD. By displaying charts and visualizations for data analysis",
     "A. All of the others"
    ],
    [
     "Câu 49. Which UI control is used to display tabular data in ABAP Analytical App Development? (Choose 1 answer)\n\nA. Smart Table control\nB. ALV Grid control\nC. Chart control\nD. Table control",
     "A. Smart Table control"
    ],
    [
     "Câu 50. Which UI control is commonly used to display simple charts in Analytical App Development? (Choose 1 answer)\n\nA. Chart control\nB. Smart Table control\nC. ALV Grid control\nD. Table control",
     "A. Chart control"
    ]
   ]
  }
 ]
},
{
 "id": "sap341-su24re-v1",
 "extends": "sap341-v1",
 "subject": {
  "name": "SAP341",
  "description": "SAP341 · Đề FA2023 B10W RE, 50 câu theo mảng kiến thức",
  "icon": "code",
  "color": "#a3e635"
 },
 "sets": [
  {
   "into": "Mảng 1: Nhập môn ABAP và SAP NetWeaver",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE, SU2024 RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 19. What is SAP GUI Easy Access? (Choose 1 answer)\n\nA. A graphical user interface for accessing the SAP system.\nB. A mobile application for monitoring SAP system performance.\nC. A web-based interface for managing SAP user roles.\nD. A programming language for developing SAP applications.",
     "A. A graphical user interface for accessing the SAP system."
    ],
    [
     "Câu 23. What are Business Server Pages (BSP) in ABAP? (Choose 1 answer)\n\nA. They are server-side scripts that generate HTML pages.\nB. They are client-side scripts that generate HTML pages.\nC. They are server-side scripts that generate ABAP code.\nD. None of the others.",
     "A. They are server-side scripts that generate HTML pages."
    ]
   ]
  },
  {
   "into": "Mảng 2: Môi trường và quản lý phát triển",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE, SU2024 RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 21. What happens to the program code after it is pulled to Eclipse? (Choose 1 answer)\n\nA. It is developed offline\nB. It is stored in the Java Runtime Environment\nC. It is sent to the SAP GUI for Windows\nD. It is stored online on the server",
     "A. It is developed offline\n\nGhi chú: bình luận không thống nhất. 2 bình luận cũ (harry, thkgaming156) chọn D; 3 bình luận mới hơn (minh109 \"A slide\", nan0nun, tien111) chọn A. Chọn A theo bình luận mới nhất có nhắc slide, độ tin cậy thấp. Kiểm lại: nghiêng về D. Với ABAP in Eclipse, code vẫn nằm và được phát triển trên server (Eclipse không làm offline). Đề SU2024 FE câu 19 \"Where is ABAP code developed?\" cũng có đáp án \"Online on the server\". Nếu thi gặp, nên chọn D."
    ],
    [
     "Câu 22. What is ABAP in Eclipse? (Choose 1 answer)\n\nA. An additional Eclipse plugin\nB. A standalone software\nC. A type of SAP system\nD. A Java Runtime Environment",
     "A. An additional Eclipse plugin"
    ],
    [
     "Câu 32. What version of a program does the SAP system execute? (Choose 1 answer)\n\nA. The last activated version\nB. The first activated version\nC. The version before the last activated version\nD. None of the others",
     "A. The last activated version"
    ]
   ]
  },
  {
   "into": "Mảng 3: ABAP Data Dictionary",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE, SU2024 RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 17. What is the purpose of the INTO clause in an OpenSQL SELECT statement? (Choose 1 answer)\n\nA. To specify the ABAP variable or structure where the retrieved data should be stored\nB. To specify the table to retrieve data from\nC. To specify the conditions that the data must meet\nD. To specify the columns to be retrieved",
     "A. To specify the ABAP variable or structure where the retrieved data should be stored"
    ],
    [
     "Câu 18. What is OpenSQL in ABAP programming? (Choose 1 answer)\n\nA. A set of ABAP statements that provide access to the database\nB. A database management system\nC. A user interface technology\nD. A programming language",
     "A. A set of ABAP statements that provide access to the database"
    ]
   ]
  },
  {
   "into": "Mảng 4: Lập trình ABAP cơ bản",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE, SU2024 RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 9. Which of the following is NOT a form of modularization in ABAP? (Choose 1 answer)\n\nA. Data Classes\nB. Function Modules\nC. Business Application Programming Interfaces (BAPIs)\nD. Subroutines (FORMs)",
     "A. Data Classes"
    ],
    [
     "Câu 38. Which of the following is not a type of Dynpro GUI element? (Choose 1 answer)\n\nA. Database tables\nB. Check boxes\nC. Input fields\nD. Text",
     "A. Database tables"
    ],
    [
     "Câu 39. What is the 'Parameters' keyword used for in ABAP? (Choose 1 answer)\n\nA. To declare variables\nB. To handle exceptions\nC. To format output results\nD. To perform database operations",
     "A. To declare variables"
    ],
    [
     "Câu 41. What is the purpose of selection screens in ABAP programming? (Choose 1 answer)\n\nA. To simplify interaction with the user\nB. To store data in the database\nC. To display output results\nD. To perform complex calculations",
     "A. To simplify interaction with the user"
    ]
   ]
  },
  {
   "into": "Mảng 5: OOP trong ABAP",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE, SU2024 RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 24. Which principle involves hiding the internal implementation details of an object? (Choose 1 answer)\n\nA. Encapsulation\nB. Inheritance\nC. Polymorphism\nD. Abstraction",
     "A. Encapsulation"
    ],
    [
     "Câu 26. Which principle allows a class to inherit attributes and methods from another class? (Choose 1 answer)\n\nA. Inheritance\nB. Encapsulation\nC. Polymorphism\nD. Abstraction",
     "A. Inheritance"
    ]
   ]
  },
  {
   "into": "Mảng 6: Exception và Lock Object",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE, SU2024 RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 1. What is the purpose of CX_STATIC_CHECK exception class? (Choose 1 answer)\n\nA. It is raised when a syntax error occurs during static program checks\nB. It is raised when a runtime error occurs during program execution\nC. It is raised when a logical error is detected in the program",
     "A. It is raised when a syntax error occurs during static program checks\n\nGhi chú: Kiểm lại: bản thân exception luôn xảy ra lúc chạy; \"static check\" nghĩa là trình kiểm tra cú pháp bắt buộc phải xử lý (CATCH) hoặc khai báo (RAISING) exception này. A không chính xác hẳn nhưng là phương án gần nhất trong 3 lựa chọn, giữ A."
    ],
    [
     "Câu 2. Which exception class is used for dynamic error checks? (Choose 1 answer)\n\nA. CX_DYNAMIC_CHECK\nB. CX_NO_CHECK\nC. CX_STATIC_CHECK",
     "A. CX_DYNAMIC_CHECK"
    ],
    [
     "Câu 3. Choose the incorrect information about the exception hierarchy in ABAP. (Choose 1 answer)\n\nA. Every exception class offers a range of standard methods and attributes are derived from the subclass CX_ROOT.\nB. All exception classes must be derived from one of the classes CX_STATIC_CHECK, CX_DYNAMIC_CHECK or CX_NO_CHECK.\nC. The classes CX_STATIC_CHECK, CX_DYNAMIC_CHECK, CX_NO_CHECK are subclasses of superclass CX_ROOT.\nD. None of the others.",
     "A. Every exception class offers a range of standard methods and attributes are derived from the subclass CX_ROOT.\n\nGhi chú: Kiểm lại: A là câu sai vì CX_ROOT là lớp cha (superclass), không phải \"subclass\". B và C đúng. Giữ A."
    ],
    [
     "Câu 4. What happens when CX_STATIC_CHECK exception class is raised in runtime context? (Choose 1 answer)\n\nA. The syntax error is displayed as an error message and program execution stops\nB. The syntax error is displayed as a log but program execution continues\nC. The program terminates abruptly",
     "C. The program terminates abruptly\n\nGhi chú: Kiểm lại: C đúng về kỹ thuật. Lỗi cú pháp chỉ xuất hiện lúc kiểm tra cú pháp, không phải lúc chạy; khi chạy mà exception không được bắt thì chương trình dừng với runtime error (short dump). Giữ C."
    ],
    [
     "Câu 31. How can you acquire a lock on a specific data object in SAP? (Choose 1 answer)\n\nA. Using exclusive-lock mode\nB. Using share-lock mode\nC. Using both share-lock and exclusive-lock simultaneously\nD. You cannot acquire locks on specific data objects in SAP",
     "A. Using exclusive-lock mode\n\nGhi chú: Kiểm lại: câu hỏi mơ hồ, cả shared và exclusive lock đều khóa được đối tượng dữ liệu cụ thể. Giữ A theo bình luận."
    ]
   ]
  },
  {
   "into": "Mảng 7: OData và REST",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE, SU2024 RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 7. What is the role of the Model Provider Class (MPC) in SAPUI5? (Choose 1 answer)\n\nA. Handles the data binding between the UI controls and the OData service\nB. Defines the routing configurations for navigation in the application\nC. Manages the authentication and authorization for accessing OData services\nD. Serves as a proxy server for caching OData responses",
     "A. Handles the data binding between the UI controls and the OData service\n\nGhi chú: Kiểm lại: câu hỏi có vấn đề. MPC là lớp ở backend (SEGW) định nghĩa model và metadata của OData service, không thuộc SAPUI5. Không phương án nào đúng hẳn; A gần nhất (data binding thực ra do ODataModel ở SAPUI5 làm). Giữ A."
    ],
    [
     "Câu 8. The Model Provider Class (MPC) is responsible for: (Choose 1 answer)\n\nA. Consuming OData services\nB. Validating OData requests\nC. Handling OData service metadata",
     "C. Handling OData service metadata\n\nGhi chú: Kiểm lại: C đúng (MPC định nghĩa metadata, DPC xử lý dữ liệu). Khớp đề FA2023."
    ]
   ]
  },
  {
   "into": "Mảng 8: SAPUI5, Fiori và Analytics",
   "description": "Đề SAP341 FA2023 B10W RE, SU2024 FE, SU2024 RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 12. Which method is used to attach an event handler to an HTML element in JavaScript? (Choose 1 answer)\n\nA. addEventListener()\nB. handleEvent()\nC. attachEvent()\nD. eventHandler()",
     "A. addEventListener()"
    ],
    [
     "Câu 13. How do you handle events in JavaScript? (Choose 1 answer)\n\nA. Using event handlers\nB. Using conditional statements\nC. Using loops\nD. Using callbacks",
     "A. Using event handlers"
    ],
    [
     "Câu 14. Which keyword is used to create a new instance of an object in JavaScript? (Choose 1 answer)\n\nA. new\nB. create\nC. instance\nD. object",
     "A. new"
    ],
    [
     "Câu 28. Which of the following is true about SAP Fiori apps? (Choose 1 answer)\n\nA. They are available for both desktop and mobile devices\nB. They are desktop-only applications\nC. They can only be accessed through a web browser\nD. They require a separate installation on the end-user's device",
     "A. They are available for both desktop and mobile devices"
    ],
    [
     "Câu 45. Which architectural pattern is recommended for SAPUI5 applications? (Choose 1 answer)\n\nA. Model-View-Controller (MVC)\nB. Model-View-ViewModel (MVVM)\nC. Model-View-Presenter (MVP)\nD. Model-View-Adapter (MVA)",
     "A. Model-View-Controller (MVC)"
    ],
    [
     "Câu 46. What is the role of a controller in SAPUI5? (Choose 1 answer)\n\nA. Handle user interactions and events\nB. Display data in the view\nC. Manage the application lifecycle\nD. Maintain the data and business logic",
     "A. Handle user interactions and events"
    ],
    [
     "Câu 48. Smart Table control in Analytical App Development supports which of the following features? (Choose 1 answer)\n\nA. All of the others\nB. Sorting and filtering columns\nC. Auto-binding with OData services\nD. Grouping and aggregating data",
     "B. Sorting and filtering columns\n\nGhi chú: bình luận không thống nhất. WANG28 và thkgaming156 (cũ) chọn A; minh109 (dẫn slide 14: Smart Table cho phép sắp xếp/lọc dữ liệu), nan0nun, tien111 (mới hơn) chọn B. Chọn B, độ tin cậy thấp. Kiểm lại: nghiêng về A. Smart Table hỗ trợ cả sắp xếp/lọc, tự tạo cột từ metadata OData (auto-binding) và nhóm/tổng hợp (khi dùng tableType AnalyticalTable). Đề SU2024 FE câu 48 cũng chọn \"All of the others\" cho Smart UI Controls."
    ],
    [
     "Câu 49. Which UI control is used to provide the user with the input in Analytical App Development? (Choose 1 answer)\n\nA. Smart Form control\nB. Matrix Layout control\nC. Form Container control\nD. Container control",
     "A. Smart Form control\n\nGhi chú: đa số chọn A (Michael, thkgaming156, bubucon, tien111 dẫn slide 14); P4nzer chọn C."
    ]
   ]
  },
  {
   "title": "Đề SU2024 RE · Tổng hợp 50 câu",
   "description": "Cả đề SAP341 SU2024 RE, câu 1–50 không chia mảng · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
   "cards": [
    [
     "Câu 1. What is the purpose of CX_STATIC_CHECK exception class? (Choose 1 answer)\n\nA. It is raised when a syntax error occurs during static program checks\nB. It is raised when a runtime error occurs during program execution\nC. It is raised when a logical error is detected in the program",
     "A. It is raised when a syntax error occurs during static program checks\n\nGhi chú: Kiểm lại: bản thân exception luôn xảy ra lúc chạy; \"static check\" nghĩa là trình kiểm tra cú pháp bắt buộc phải xử lý (CATCH) hoặc khai báo (RAISING) exception này. A không chính xác hẳn nhưng là phương án gần nhất trong 3 lựa chọn, giữ A."
    ],
    [
     "Câu 2. Which exception class is used for dynamic error checks? (Choose 1 answer)\n\nA. CX_DYNAMIC_CHECK\nB. CX_NO_CHECK\nC. CX_STATIC_CHECK",
     "A. CX_DYNAMIC_CHECK"
    ],
    [
     "Câu 3. Choose the incorrect information about the exception hierarchy in ABAP. (Choose 1 answer)\n\nA. Every exception class offers a range of standard methods and attributes are derived from the subclass CX_ROOT.\nB. All exception classes must be derived from one of the classes CX_STATIC_CHECK, CX_DYNAMIC_CHECK or CX_NO_CHECK.\nC. The classes CX_STATIC_CHECK, CX_DYNAMIC_CHECK, CX_NO_CHECK are subclasses of superclass CX_ROOT.\nD. None of the others.",
     "A. Every exception class offers a range of standard methods and attributes are derived from the subclass CX_ROOT.\n\nGhi chú: Kiểm lại: A là câu sai vì CX_ROOT là lớp cha (superclass), không phải \"subclass\". B và C đúng. Giữ A."
    ],
    [
     "Câu 4. What happens when CX_STATIC_CHECK exception class is raised in runtime context? (Choose 1 answer)\n\nA. The syntax error is displayed as an error message and program execution stops\nB. The syntax error is displayed as a log but program execution continues\nC. The program terminates abruptly",
     "C. The program terminates abruptly\n\nGhi chú: Kiểm lại: C đúng về kỹ thuật. Lỗi cú pháp chỉ xuất hiện lúc kiểm tra cú pháp, không phải lúc chạy; khi chạy mà exception không được bắt thì chương trình dừng với runtime error (short dump). Giữ C."
    ],
    [
     "Câu 5. What does OData stand for? (Choose 1 answer)\n\nA. Open Data Protocol\nB. Object Data Protocol\nC. Organized Data Protocol\nD. Ordered Data Protocol",
     "A. Open Data Protocol"
    ],
    [
     "Câu 6. REST is an architectural style that emphasizes: (Choose 1 answer)\n\nA. Stateless communication\nB. Stateful communication\nC. Simple object serialization\nD. Complex data transformations",
     "A. Stateless communication"
    ],
    [
     "Câu 7. What is the role of the Model Provider Class (MPC) in SAPUI5? (Choose 1 answer)\n\nA. Handles the data binding between the UI controls and the OData service\nB. Defines the routing configurations for navigation in the application\nC. Manages the authentication and authorization for accessing OData services\nD. Serves as a proxy server for caching OData responses",
     "A. Handles the data binding between the UI controls and the OData service\n\nGhi chú: Kiểm lại: câu hỏi có vấn đề. MPC là lớp ở backend (SEGW) định nghĩa model và metadata của OData service, không thuộc SAPUI5. Không phương án nào đúng hẳn; A gần nhất (data binding thực ra do ODataModel ở SAPUI5 làm). Giữ A."
    ],
    [
     "Câu 8. The Model Provider Class (MPC) is responsible for: (Choose 1 answer)\n\nA. Consuming OData services\nB. Validating OData requests\nC. Handling OData service metadata",
     "C. Handling OData service metadata\n\nGhi chú: Kiểm lại: C đúng (MPC định nghĩa metadata, DPC xử lý dữ liệu). Khớp đề FA2023."
    ],
    [
     "Câu 9. Which of the following is NOT a form of modularization in ABAP? (Choose 1 answer)\n\nA. Data Classes\nB. Function Modules\nC. Business Application Programming Interfaces (BAPIs)\nD. Subroutines (FORMs)",
     "A. Data Classes"
    ],
    [
     "Câu 10. What is the main advantage of using Function Modules? (Choose 1 answer)\n\nA. They allow for code reuse and encapsulation\nB. They can be used to create loops\nC. They are used to handle exceptions\nD. They are used to create user interfaces",
     "A. They allow for code reuse and encapsulation"
    ],
    [
     "Câu 11. Which technology is used for designing the structure and layout of web pages? (Choose 1 answer)\n\nA. HTML5\nB. CSS\nC. JavaScript\nD. ABAP",
     "A. HTML5"
    ],
    [
     "Câu 12. Which method is used to attach an event handler to an HTML element in JavaScript? (Choose 1 answer)\n\nA. addEventListener()\nB. handleEvent()\nC. attachEvent()\nD. eventHandler()",
     "A. addEventListener()"
    ],
    [
     "Câu 13. How do you handle events in JavaScript? (Choose 1 answer)\n\nA. Using event handlers\nB. Using conditional statements\nC. Using loops\nD. Using callbacks",
     "A. Using event handlers"
    ],
    [
     "Câu 14. Which keyword is used to create a new instance of an object in JavaScript? (Choose 1 answer)\n\nA. new\nB. create\nC. instance\nD. object",
     "A. new"
    ],
    [
     "Câu 15. What is the purpose of a data dictionary in ABAP programming? (Choose 1 answer)\n\nA. To serve as a global directory for data types\nB. To manage database operations\nC. To store program code\nD. To handle user interfaces",
     "A. To serve as a global directory for data types"
    ],
    [
     "Câu 16. What can be assigned to data types in the data dictionary? (Choose 1 answer)\n\nA. Help texts and explanations in different languages\nB. Values\nC. Programs\nD. Functions",
     "A. Help texts and explanations in different languages"
    ],
    [
     "Câu 17. What is the purpose of the INTO clause in an OpenSQL SELECT statement? (Choose 1 answer)\n\nA. To specify the ABAP variable or structure where the retrieved data should be stored\nB. To specify the table to retrieve data from\nC. To specify the conditions that the data must meet\nD. To specify the columns to be retrieved",
     "A. To specify the ABAP variable or structure where the retrieved data should be stored"
    ],
    [
     "Câu 18. What is OpenSQL in ABAP programming? (Choose 1 answer)\n\nA. A set of ABAP statements that provide access to the database\nB. A database management system\nC. A user interface technology\nD. A programming language",
     "A. A set of ABAP statements that provide access to the database"
    ],
    [
     "Câu 19. What is SAP GUI Easy Access? (Choose 1 answer)\n\nA. A graphical user interface for accessing the SAP system.\nB. A mobile application for monitoring SAP system performance.\nC. A web-based interface for managing SAP user roles.\nD. A programming language for developing SAP applications.",
     "A. A graphical user interface for accessing the SAP system."
    ],
    [
     "Câu 20. Which of the following is a key feature of the SAP GUI for HTML? (Choose 1 answer)\n\nA. It allows access to the SAP system through a web browser.\nB. It requires the installation of additional software on the client machine.\nC. It provides offline access to the SAP system.\nD. It supports only a limited set of SAP transactions.",
     "A. It allows access to the SAP system through a web browser."
    ],
    [
     "Câu 21. What happens to the program code after it is pulled to Eclipse? (Choose 1 answer)\n\nA. It is developed offline\nB. It is stored in the Java Runtime Environment\nC. It is sent to the SAP GUI for Windows\nD. It is stored online on the server",
     "A. It is developed offline\n\nGhi chú: bình luận không thống nhất. 2 bình luận cũ (harry, thkgaming156) chọn D; 3 bình luận mới hơn (minh109 \"A slide\", nan0nun, tien111) chọn A. Chọn A theo bình luận mới nhất có nhắc slide, độ tin cậy thấp. Kiểm lại: nghiêng về D. Với ABAP in Eclipse, code vẫn nằm và được phát triển trên server (Eclipse không làm offline). Đề SU2024 FE câu 19 \"Where is ABAP code developed?\" cũng có đáp án \"Online on the server\". Nếu thi gặp, nên chọn D."
    ],
    [
     "Câu 22. What is ABAP in Eclipse? (Choose 1 answer)\n\nA. An additional Eclipse plugin\nB. A standalone software\nC. A type of SAP system\nD. A Java Runtime Environment",
     "A. An additional Eclipse plugin"
    ],
    [
     "Câu 23. What are Business Server Pages (BSP) in ABAP? (Choose 1 answer)\n\nA. They are server-side scripts that generate HTML pages.\nB. They are client-side scripts that generate HTML pages.\nC. They are server-side scripts that generate ABAP code.\nD. None of the others.",
     "A. They are server-side scripts that generate HTML pages."
    ],
    [
     "Câu 24. Which principle involves hiding the internal implementation details of an object? (Choose 1 answer)\n\nA. Encapsulation\nB. Inheritance\nC. Polymorphism\nD. Abstraction",
     "A. Encapsulation"
    ],
    [
     "Câu 25. How can you achieve encapsulation in ABAP Objects? (Choose 1 answer)\n\nA. By using private attributes and methods\nB. By using static methods\nC. By using polymorphism\nD. By using inherited methods",
     "A. By using private attributes and methods"
    ],
    [
     "Câu 26. Which principle allows a class to inherit attributes and methods from another class? (Choose 1 answer)\n\nA. Inheritance\nB. Encapsulation\nC. Polymorphism\nD. Abstraction",
     "A. Inheritance"
    ],
    [
     "Câu 27. Which keyword is used to declare a class in ABAP Objects? (Choose 1 answer)\n\nA. CLASS\nB. METHOD\nC. FUNCTION\nD. INTERFACE",
     "A. CLASS"
    ],
    [
     "Câu 28. Which of the following is true about SAP Fiori apps? (Choose 1 answer)\n\nA. They are available for both desktop and mobile devices\nB. They are desktop-only applications\nC. They can only be accessed through a web browser\nD. They require a separate installation on the end-user's device",
     "A. They are available for both desktop and mobile devices"
    ],
    [
     "Câu 29. What is SAP Fiori? (Choose 1 answer)\n\nA. A design principle\nB. A programming language\nC. An application framework\nD. An ERP system",
     "A. A design principle\n\nGhi chú: bình luận không thống nhất: Quangdung (ref slide 13), thkgaming156, bubucon chọn A; alibaba và alakadabra (bị -13) chọn C. Chọn A."
    ],
    [
     "Câu 30. What is the purpose of an exclusive lock in SAP? (Choose 1 answer)\n\nA. To prevent other transactions from modifying the locked data\nB. To prevent other transactions from reading the locked data\nC. To allow other transactions to read the locked data concurrently\nD. To allow other transactions to modify the locked data concurrently",
     "A. To prevent other transactions from modifying the locked data"
    ],
    [
     "Câu 31. How can you acquire a lock on a specific data object in SAP? (Choose 1 answer)\n\nA. Using exclusive-lock mode\nB. Using share-lock mode\nC. Using both share-lock and exclusive-lock simultaneously\nD. You cannot acquire locks on specific data objects in SAP",
     "A. Using exclusive-lock mode\n\nGhi chú: Kiểm lại: câu hỏi mơ hồ, cả shared và exclusive lock đều khóa được đối tượng dữ liệu cụ thể. Giữ A theo bình luận."
    ],
    [
     "Câu 32. What version of a program does the SAP system execute? (Choose 1 answer)\n\nA. The last activated version\nB. The first activated version\nC. The version before the last activated version\nD. None of the others",
     "A. The last activated version"
    ],
    [
     "Câu 33. What is the role of ABAP in SAP Netweaver? (Choose 1 answer)\n\nA. It is a runtime\nB. It is a type of database\nC. It is a type of operating system\nD. It is a programming language",
     "D. It is a programming language\n\nGhi chú: bình luận không thống nhất. WANG28, thkgaming156, nan0nun chọn D; minh109 (\"a slide nhé\") và tien111 chọn A. Chọn D theo số đông, độ tin cậy thấp; nếu slide ghi A thì đổi sang A. Kiểm lại: D khớp với đề FA2023 câu 23 (cùng câu, cùng đáp án \"It is a programming language\"). Giữ D, độ tin cậy cao hơn."
    ],
    [
     "Câu 34. What is SAP Netweaver? (Choose 1 answer)\n\nA. A platform to support various SAP applications\nB. A type of database\nC. A programming language\nD. A type of operating system",
     "A. A platform to support various SAP applications"
    ],
    [
     "Câu 35. What is the purpose of creating your own package in SAP? (Choose 1 answer)\n\nA. To group your developments\nB. To delete your developments\nC. To lock your developments for editing\nD. None of the others",
     "A. To group your developments"
    ],
    [
     "Câu 36. What is a transport request? (Choose 1 answer)\n\nA. A package which is used to transfer data from one SAP installation to another\nB. A tool for managing the database of SAP systems\nC. A tool for developing new SAP systems\nD. A tool for monitoring the performance of SAP systems",
     "A. A package which is used to transfer data from one SAP installation to another"
    ],
    [
     "Câu 37. What is the purpose of the Process After Input (PAI) in a Dynpro? (Choose 1 answer)\n\nA. It is triggered after the user input\nB. It is triggered when the program ends\nC. It is triggered before the screen is displayed\nD. It is triggered when the program starts",
     "A. It is triggered after the user input"
    ],
    [
     "Câu 38. Which of the following is not a type of Dynpro GUI element? (Choose 1 answer)\n\nA. Database tables\nB. Check boxes\nC. Input fields\nD. Text",
     "A. Database tables"
    ],
    [
     "Câu 39. What is the 'Parameters' keyword used for in ABAP? (Choose 1 answer)\n\nA. To declare variables\nB. To handle exceptions\nC. To format output results\nD. To perform database operations",
     "A. To declare variables"
    ],
    [
     "Câu 40. What is the keyword used to declare data in ABAP? (Choose 1 answer)\n\nA. DATA\nB. DECLARE\nC. DEFINE\nD. None of the others",
     "A. DATA"
    ],
    [
     "Câu 41. What is the purpose of selection screens in ABAP programming? (Choose 1 answer)\n\nA. To simplify interaction with the user\nB. To store data in the database\nC. To display output results\nD. To perform complex calculations",
     "A. To simplify interaction with the user"
    ],
    [
     "Câu 42. What is the Dynpro number for selection screens? (Choose 1 answer)\n\nA. 1000\nB. 500\nC. 100\nD. 2000",
     "A. 1000"
    ],
    [
     "Câu 43. Which data type is used for floating-point numbers in ABAP? (Choose 1 answer)\n\nA. F\nB. P\nC. I\nD. INT8",
     "A. F"
    ],
    [
     "Câu 44. What is the purpose of a SAPUI5 component? (Choose 1 answer)\n\nA. Separate and encapsulate reusable parts of an application\nB. Handle data binding between model and view\nC. Define routing configurations\nD. Manage user authentication",
     "A. Separate and encapsulate reusable parts of an application"
    ],
    [
     "Câu 45. Which architectural pattern is recommended for SAPUI5 applications? (Choose 1 answer)\n\nA. Model-View-Controller (MVC)\nB. Model-View-ViewModel (MVVM)\nC. Model-View-Presenter (MVP)\nD. Model-View-Adapter (MVA)",
     "A. Model-View-Controller (MVC)"
    ],
    [
     "Câu 46. What is the role of a controller in SAPUI5? (Choose 1 answer)\n\nA. Handle user interactions and events\nB. Display data in the view\nC. Manage the application lifecycle\nD. Maintain the data and business logic",
     "A. Handle user interactions and events"
    ],
    [
     "Câu 47. What is routing in SAPUI5? (Choose 1 answer)\n\nA. The process of mapping URLs to different views in an application\nB. The process of defining access control rules for different user roles\nC. The process of defining data binding between models and views\nD. The process of managing user sessions and authentication",
     "A. The process of mapping URLs to different views in an application"
    ],
    [
     "Câu 48. Smart Table control in Analytical App Development supports which of the following features? (Choose 1 answer)\n\nA. All of the others\nB. Sorting and filtering columns\nC. Auto-binding with OData services\nD. Grouping and aggregating data",
     "B. Sorting and filtering columns\n\nGhi chú: bình luận không thống nhất. WANG28 và thkgaming156 (cũ) chọn A; minh109 (dẫn slide 14: Smart Table cho phép sắp xếp/lọc dữ liệu), nan0nun, tien111 (mới hơn) chọn B. Chọn B, độ tin cậy thấp. Kiểm lại: nghiêng về A. Smart Table hỗ trợ cả sắp xếp/lọc, tự tạo cột từ metadata OData (auto-binding) và nhóm/tổng hợp (khi dùng tableType AnalyticalTable). Đề SU2024 FE câu 48 cũng chọn \"All of the others\" cho Smart UI Controls."
    ],
    [
     "Câu 49. Which UI control is used to provide the user with the input in Analytical App Development? (Choose 1 answer)\n\nA. Smart Form control\nB. Matrix Layout control\nC. Form Container control\nD. Container control",
     "A. Smart Form control\n\nGhi chú: đa số chọn A (Michael, thkgaming156, bubucon, tien111 dẫn slide 14); P4nzer chọn C."
    ],
    [
     "Câu 50. What is the goal to create Analytical App Development? (Choose 1 answer)\n\nA. Analytical reports and dashboards\nB. Desktop applications\nC. Mobile applications\nD. Web services",
     "A. Analytical reports and dashboards"
    ]
   ]
  }
 ]
}
);
