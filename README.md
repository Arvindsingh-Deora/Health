# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Configuration

To use the AI features in this application, you need a Google AI API key.

1.  **Get a Free API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create a new API key. It's free and only takes a moment.

2.  **Set Up Your Environment File**:
    *   In the file explorer on the left, create a new file named `.env.local` in the root directory of this project (right next to `README.md`).
    *   Add the following line to that new file, replacing `your_api_key_here` with the key you just got from Google AI Studio:
        ```
        GOOGLE_API_KEY=your_api_key_here
        ```

3.  **Restart the Server**: The app will automatically pick up the key. If it was already running, it might need a moment to refresh.

## Development

To get started with the app code, take a look at `src/app/page.tsx`.
