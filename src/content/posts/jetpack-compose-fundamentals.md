---
title: "Jetpack Compose Fundamentals: Build Android UI the Declarative Way"
date: "2026-08-20"
excerpt: "A practical beginner guide to Jetpack Compose: composables, layouts, modifiers, state, lists, theming, navigation, side effects, accessibility, and testing."
tags: ["android", "kotlin", "jetpack-compose", "mobile-development"]
---

Jetpack Compose is Android's modern toolkit for building native UI with Kotlin. Instead of describing a sequence of view mutations, you describe what the UI should look like for current state. Compose calls your functions again when observed state changes and updates only affected parts of the UI.

This tutorial covers core concepts needed to build small Compose screens and understand larger apps.

## What You Need

Use Android Studio with an Android project configured for Compose. The exact dependency versions belong in your project's version catalog or Gradle files. New Android Studio projects can generate this setup for you.

You should know basic Kotlin:

- Functions and lambdas
- Nullable types
- Data classes
- Collections
- `when` expressions
- Coroutines at a basic level

Compose code usually lives in files ending with `.kt`.

## Your First Composable

A composable is a Kotlin function marked with `@Composable`. It emits UI instead of returning a `View`.

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

Composable functions should describe UI from input values. They can call other composables, but they should not depend on hidden mutable state when avoidable.

Start Compose from an `Activity` with `setContent`:

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyAppTheme {
                Greeting(name = "Compose")
            }
        }
    }
}
```

`setContent` replaces the traditional XML layout entry point for this screen.

## Preview Composables

Android Studio can render a composable without running the app when it has a `@Preview` function.

```kotlin
@Preview(showBackground = true)
@Composable
private fun GreetingPreview() {
    MyAppTheme {
        Greeting(name = "Preview")
    }
}
```

Keep previews small and provide representative parameters. Preview functions are development tools, not production entry points.

## Basic Layouts

Compose has three primary layout primitives:

- `Column`: places children vertically
- `Row`: places children horizontally
- `Box`: stacks children on top of each other

```kotlin
@Composable
fun ProfileCard() {
    Row(
        modifier = Modifier.padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(56.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primary),
        )

        Spacer(modifier = Modifier.width(12.dp))

        Column {
            Text(text = "Ada Lovelace", style = MaterialTheme.typography.titleMedium)
            Text(text = "Developer", style = MaterialTheme.typography.bodyMedium)
        }
    }
}
```

Use `Arrangement` for spacing and distribution:

```kotlin
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.SpaceBetween,
) {
    Text("Start")
    Text("End")
}
```

Use `Modifier.weight(1f)` when one child should consume remaining space:

```kotlin
Row(modifier = Modifier.fillMaxWidth()) {
    Text("Label")
    Spacer(modifier = Modifier.weight(1f))
    IconButton(onClick = { /* refresh */ }) {
        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
    }
}
```

## Modifiers

Modifiers configure layout, appearance, behavior, and interaction. They are applied in order, so order can change behavior.

```kotlin
Text(
    text = "Important",
    modifier = Modifier
        .fillMaxWidth()
        .background(MaterialTheme.colorScheme.surfaceVariant)
        .padding(16.dp),
)
```

This fills width, paints background, then adds inner padding. Compare it with padding before background:

```kotlin
Modifier
    .padding(16.dp)
    .background(MaterialTheme.colorScheme.surfaceVariant)
```

Here, padding sits outside the background.

Common modifiers:

| Modifier | Purpose |
|---|---|
| `padding` | Add space around content |
| `size`, `width`, `height` | Set dimensions |
| `fillMaxWidth`, `fillMaxSize` | Consume available space |
| `background` | Paint a background |
| `clip` | Clip content to a shape |
| `clickable` | Make content interactive |
| `weight` | Share remaining space in `Row` or `Column` |
| `verticalScroll` | Make content scroll vertically |
| `testTag` | Give UI test selectors a stable identifier |

Do not use `Modifier` as a hidden global value. Accept it as the first optional parameter in reusable composables:

```kotlin
@Composable
fun ArticleTitle(
    title: String,
    modifier: Modifier = Modifier,
) {
    Text(
        text = title,
        modifier = modifier,
        style = MaterialTheme.typography.headlineSmall,
    )
}
```

## State and Recomposition

State is data that can change over time. Compose observes state created with `remember` and `mutableStateOf`.

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableIntStateOf(0) }

    Column {
        Text(text = "Count: $count")
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

When `count` changes, Compose recomposes functions that read `count`. It does not rebuild the entire screen blindly.

Use `rememberSaveable` when simple UI state should survive configuration changes and activity recreation:

```kotlin
var query by rememberSaveable { mutableStateOf("") }
```

Do not store important business state only in a composable. Move it to a `ViewModel` when it must survive screen recreation, be shared, or be loaded from a repository.

## State Hoisting

State hoisting moves state to the caller and passes values plus event callbacks down. This makes a composable reusable and easier to test.

```kotlin
@Composable
fun SearchField(
    query: String,
    onQueryChange: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        label = { Text("Search") },
        modifier = modifier.fillMaxWidth(),
    )
}

@Composable
fun SearchScreen() {
    var query by rememberSaveable { mutableStateOf("") }

    SearchField(
        query = query,
        onQueryChange = { query = it },
        modifier = Modifier.padding(16.dp),
    )
}
```

A useful rule: the owner of state owns decisions; child composables emit events.

## Events and Unidirectional Data Flow

A screen often follows this loop:

1. State flows down into composables.
2. User actions flow up as events.
3. State holder handles events and exposes updated state.

```kotlin
data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val loading: Boolean = false,
)

class LoginViewModel : ViewModel() {
    var uiState by mutableStateOf(LoginUiState())
        private set

    fun onEmailChange(value: String) {
        uiState = uiState.copy(email = value)
    }

    fun onPasswordChange(value: String) {
        uiState = uiState.copy(password = value)
    }
}
```

Production code commonly exposes immutable state, such as `StateFlow`, and updates it inside the `ViewModel`. The important boundary is that UI reads state but does not mutate the state holder directly.

## Material Components and Theming

Material 3 provides components and design tokens:

```kotlin
@Composable
fun SaveButton(onSave: () -> Unit) {
    Button(onClick = onSave) {
        Icon(Icons.Default.Save, contentDescription = null)
        Spacer(modifier = Modifier.width(8.dp))
        Text("Save")
    }
}
```

Use `MaterialTheme` instead of hard-coded colors and text sizes:

```kotlin
Text(
    text = "Welcome back",
    color = MaterialTheme.colorScheme.onSurface,
    style = MaterialTheme.typography.headlineMedium,
)
```

A theme usually supplies color scheme, typography, and shapes around the app:

```kotlin
@Composable
fun MyAppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = Color(0xFF6750A4),
        ),
        content = content,
    )
}
```

Keep theme decisions in one place. Components should consume theme tokens, not recreate them.

## Lists and Lazy Layouts

Use `LazyColumn` for vertically scrolling lists. It composes visible items instead of creating every item immediately.

```kotlin
data class Task(val id: Long, val title: String, val done: Boolean)

@Composable
fun TaskList(tasks: List<Task>, onToggle: (Long) -> Unit) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        items(
            items = tasks,
            key = { it.id },
        ) { task ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onToggle(task.id) }
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Checkbox(
                    checked = task.done,
                    onCheckedChange = { onToggle(task.id) },
                )
                Text(task.title)
            }
        }
    }
}
```

Stable keys help Compose preserve item state when list order changes. Use `LazyRow` for horizontal lists and `LazyVerticalGrid` for grids.

## Forms and Input

Text input is controlled by `value` and `onValueChange`:

```kotlin
@Composable
fun EmailField(
    email: String,
    onEmailChange: (String) -> Unit,
) {
    OutlinedTextField(
        value = email,
        onValueChange = onEmailChange,
        label = { Text("Email") },
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
    )
}
```

Keep validation close to state handling, not buried inside the input component. Expose error state explicitly:

```kotlin
OutlinedTextField(
    value = email,
    onValueChange = onEmailChange,
    isError = email.isNotEmpty() && !email.contains("@"),
    supportingText = {
        if (email.isNotEmpty() && !email.contains("@")) {
            Text("Enter a valid email")
        }
    },
)
```

## Side Effects

Composable functions should stay close to pure descriptions. Use effect APIs for work tied to composition.

`LaunchedEffect` starts a coroutine when its key enters composition and cancels it when the key leaves:

```kotlin
@Composable
fun UserScreen(userId: String, viewModel: UserViewModel) {
    LaunchedEffect(userId) {
        viewModel.loadUser(userId)
    }

    // Render viewModel.uiState here.
}
```

`DisposableEffect` is useful when setup requires cleanup:

```kotlin
@Composable
fun LifecycleLogger(onEvent: (String) -> Unit) {
    val owner = LocalLifecycleOwner.current

    DisposableEffect(owner) {
        val observer = LifecycleEventObserver { _, event ->
            onEvent(event.name)
        }
        owner.lifecycle.addObserver(observer)
        onDispose { owner.lifecycle.removeObserver(observer) }
    }
}
```

Do not launch network requests directly in the composable body. Recomposition can happen many times.

## Navigation Basics

With Navigation Compose, define destinations and pass navigation events into screens rather than passing a `NavController` through every child.

```kotlin
@Composable
fun AppNavHost() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "home",
    ) {
        composable("home") {
            HomeScreen(onOpenDetails = { id ->
                navController.navigate("details/$id")
            })
        }
        composable("details/{id}") { entry ->
            val id = entry.arguments?.getString("id").orEmpty()
            DetailsScreen(id = id)
        }
    }
}
```

For larger apps, prefer typed routes or another centralized route model where supported by your Navigation version. Avoid putting large objects into routes; pass an ID and load the object from a state holder.

## Accessibility

Accessibility is part of UI behavior, not a final polish step.

- Add meaningful `contentDescription` to informative icons.
- Use `contentDescription = null` for decorative icons beside a text label.
- Prefer semantic Material components over custom clickable shapes.
- Keep touch targets large enough for comfortable interaction.
- Expose state to screen readers with labels and supporting text.
- Test with TalkBack and keyboard navigation where applicable.

```kotlin
IconButton(onClick = onDelete) {
    Icon(
        imageVector = Icons.Default.Delete,
        contentDescription = "Delete task",
    )
}
```

## Testing Compose UI

Compose tests find nodes by text, content description, semantics, or test tags.

```kotlin
class GreetingTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun greeting_showsName() {
        composeRule.setContent {
            Greeting(name = "Compose")
        }

        composeRule
            .onNodeWithText("Hello, Compose!")
            .assertIsDisplayed()
    }
}
```

For dynamic or ambiguous UI, add a test tag deliberately:

```kotlin
Button(
    onClick = onSave,
    modifier = Modifier.testTag("save-button"),
) {
    Text("Save")
}
```

Prefer assertions about user-visible behavior. Avoid tests coupled to implementation details such as exact layout nesting.

## Common Mistakes

### Mutating a Regular Variable

This does not trigger recomposition:

```kotlin
var count = 0
```

Use observable state:

```kotlin
var count by remember { mutableIntStateOf(0) }
```

### Doing Work During Composition

Do not perform database or network work directly in the composable body. Use a `ViewModel`, repository, and effect APIs where appropriate.

### Missing Stable List Keys

Without keys, inserting an item near the top can make Compose associate remembered item state with the wrong row. Provide a stable ID with `key = { item.id }`.

### Passing State Setters Everywhere

Prefer domain events such as `onTaskChecked(id)` over exposing arbitrary setters. This keeps child composables focused and makes state transitions easier to reason about.

### Overusing `remember`

`remember` is for values that should survive recomposition. It is not a replacement for a `ViewModel`, repository, or persistent storage.

### Ignoring Modifier Order

`padding().background()` and `background().padding()` have different visual results. Read modifiers as an ordered chain.

## A Practical Screen Structure

For a typical feature, keep responsibilities separated:

```kotlin
@Composable
fun TasksRoute(viewModel: TasksViewModel = viewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    TasksScreen(
        state = state,
        onEvent = viewModel::onEvent,
    )
}

@Composable
fun TasksScreen(
    state: TasksUiState,
    onEvent: (TasksEvent) -> Unit,
) {
    // Render state. Emit events. Avoid repository calls here.
}
```

`TasksRoute` connects Android and state management. `TasksScreen` renders state and emits events. This split keeps the UI previewable and makes tests straightforward.

## App Architecture

Compose is UI toolkit, not full app architecture. A maintainable feature usually separates responsibilities into layers:

- **UI layer**: composables render state and emit user events.
- **ViewModel**: owns screen state and coordinates work across its lifetime.
- **Domain layer**: optional use cases for business rules that deserve names and tests.
- **Data layer**: repository hides whether data comes from network, database, or cache.
- **Data sources**: Retrofit API, Room database, file storage, or another external system.

Keep dependencies pointing inward. UI should depend on a ViewModel or use-case contract, not directly on Retrofit.

### Repository Pattern

The repository gives the rest of the app one API for data access:

```kotlin
data class Article(
    val id: Long,
    val title: String,
)

interface ArticleRepository {
    suspend fun getArticles(): Result<List<Article>>
}

class DefaultArticleRepository(
    private val api: ArticleApi,
) : ArticleRepository {
    override suspend fun getArticles(): Result<List<Article>> = runCatching {
        api.getArticles().map { it.toDomain() }
    }
}
```

The repository is the right place to map API DTOs to domain models and choose cache behavior. UI should not know JSON field names or HTTP details.

### Use-Case Pattern

Add a use case when business logic is non-trivial, reused, or needs an isolated test. Do not create one class for every one-line repository call.

```kotlin
class LoadFeaturedArticles(
    private val repository: ArticleRepository,
) {
    suspend operator fun invoke(): Result<List<Article>> =
        repository.getArticles().map { articles ->
            articles.filter { it.title.isNotBlank() }
        }
}
```

This is still ordinary Kotlin. Patterns should clarify ownership, not create ceremony.

## Loading Data from an API

Retrofit turns an HTTP API into a Kotlin interface. Define DTOs for the wire format:

```kotlin
data class ArticleDto(
    val id: Long,
    val title: String,
)

fun ArticleDto.toDomain() = Article(
    id = id,
    title = title,
)
```

Define endpoints with `suspend` functions:

```kotlin
interface ArticleApi {
    @GET("articles")
    suspend fun getArticles(): List<ArticleDto>
}
```

When the response body type is non-null, Retrofit returns it for successful responses and throws for HTTP errors or conversion failures. Catch errors at the repository or ViewModel boundary and convert them into UI state.

Create a Retrofit client in one place:

```kotlin
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
    .build()

val articleApi = retrofit.create<ArticleApi>()
```

Production apps should inject this client rather than construct it inside a screen.

### UI State for API Requests

Represent loading, success, and failure explicitly:

```kotlin
data class ArticlesUiState(
    val isLoading: Boolean = false,
    val articles: List<Article> = emptyList(),
    val errorMessage: String? = null,
)
```

The ViewModel owns the request:

```kotlin
class ArticlesViewModel(
    private val repository: ArticleRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(ArticlesUiState())
    val uiState: StateFlow<ArticlesUiState> = _uiState.asStateFlow()

    fun loadArticles() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            repository.getArticles()
                .onSuccess { articles ->
                    _uiState.value = ArticlesUiState(articles = articles)
                }
                .onFailure { error ->
                    _uiState.value = ArticlesUiState(
                        errorMessage = error.message ?: "Unable to load articles",
                    )
                }
        }
    }
}
```

Collect state from Compose with lifecycle awareness:

```kotlin
@Composable
fun ArticlesRoute(viewModel: ArticlesViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) {
        viewModel.loadArticles()
    }

    ArticlesScreen(state = state)
}
```

Render every state explicitly:

```kotlin
@Composable
fun ArticlesScreen(state: ArticlesUiState) {
    when {
        state.isLoading -> CircularProgressIndicator()
        state.errorMessage != null -> Text(state.errorMessage)
        else -> LazyColumn {
            items(state.articles, key = { it.id }) { article ->
                Text(article.title)
            }
        }
    }
}
```

For retry, expose `onRetry` from the route and call `viewModel.loadArticles()`. Do not retry indefinitely without a user action or bounded policy.

## Dependency Injection with Hilt

Dependency injection means objects receive dependencies from outside instead of constructing them internally. It improves testing and keeps wiring separate from business logic.

Hilt is Android's standard Dagger-based DI solution. Basic setup has four parts.

### 1. Register the Application

```kotlin
@HiltAndroidApp
class MyApplication : Application()
```

Declare this application in `AndroidManifest.xml`:

```xml
<application
    android:name=".MyApplication"
    ... />
```

### 2. Enable Injection in Android Components

```kotlin
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { AppNavHost() }
    }
}
```

### 3. Inject Constructor Dependencies

Hilt can construct classes whose dependencies are also known to Hilt:

```kotlin
@Singleton
class DefaultArticleRepository @Inject constructor(
    private val api: ArticleApi,
) : ArticleRepository {
    override suspend fun getArticles(): Result<List<Article>> = runCatching {
        api.getArticles().map { it.toDomain() }
    }
}
```

Bind the interface to implementation:

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    @Singleton
    abstract fun bindArticleRepository(
        repository: DefaultArticleRepository,
    ): ArticleRepository
}
```

Use `@Provides` when creating an object requires a builder or third-party type:

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideArticleApi(): ArticleApi = Retrofit.Builder()
        .baseUrl("https://api.example.com/")
        .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
        .build()
        .create()
}
```

In a real app, provide `Retrofit` separately if multiple APIs share its client. Keep base URLs out of UI code and load environment-specific values from build configuration.

### 4. Inject a ViewModel

```kotlin
@HiltViewModel
class ArticlesViewModel @Inject constructor(
    private val repository: ArticleRepository,
) : ViewModel() {
    // State and events stay same as previous example.
}
```

Retrieve it in Compose with `hiltViewModel()` from a Hilt-enabled navigation destination. Hilt owns the ViewModel lifecycle; do not instantiate it with `ArticlesViewModel(...)` inside a composable.

### Hilt Dependencies

Use your project's version catalog and current Android documentation for versions. Typical setup includes Hilt's Android runtime, its compiler through KSP, and the Hilt Navigation Compose integration. Keep versions centralized instead of scattering them across Gradle files.

## Other Useful Patterns

### Single Source of Truth

One layer should own authoritative state. For offline-capable apps, Room can be the observable source of truth while the repository refreshes it from the API:

```kotlin
interface ArticleRepository {
    fun observeArticles(): Flow<List<Article>>
    suspend fun refresh()
}
```

The UI observes the local `Flow`; network synchronization updates the database. This avoids separate, conflicting UI and cache states.

### Mapper Pattern

Keep transport, database, and domain models separate when their lifecycles differ:

```kotlin
fun ArticleDto.toDomain() = Article(id = id, title = title)
fun ArticleEntity.toDomain() = Article(id = id, title = title)
```

For tiny apps with identical models, one model can be enough. Split models when API changes, persistence concerns, or business rules start leaking across layers.

### Sealed UI Events

Use a sealed type when a screen has several event kinds:

```kotlin
sealed interface ArticlesEvent {
    data object Retry : ArticlesEvent
    data class OpenArticle(val id: Long) : ArticlesEvent
}
```

This gives the ViewModel one event entry point and makes exhaustive `when` handling possible.

### Dependency Inversion

High-level code should depend on contracts, not concrete network clients. `ArticlesViewModel` depends on `ArticleRepository`; tests can provide a fake repository without HTTP, Android, or Hilt.

```kotlin
class FakeArticleRepository : ArticleRepository {
    override suspend fun getArticles() = Result.success(
        listOf(Article(id = 1, title = "Test article")),
    )
}

// ViewModel test can inject FakeArticleRepository directly.
```

## Mental Model

Remember these rules:

1. Composables describe UI from current inputs.
2. State changes trigger recomposition for readers of that state.
3. State flows down; events flow up.
4. `Modifier` controls layout and behavior in order.
5. Lazy layouts render large collections efficiently.
6. Side effects belong in effect APIs or state holders, not arbitrary composition code.
7. Theme tokens and semantics make UI consistent and accessible.

Start with one screen: build layout with `Column`, `Row`, and `Box`; add `Modifier`; hoist changing state; then introduce a `ViewModel` when screen logic grows. Compose becomes easier once every function has clear inputs and every event has one obvious owner.
