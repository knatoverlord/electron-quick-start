/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
let stream;
let recorder;

document.getElementById("startrecord").addEventListener('click', async (event) => {
    stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true
    });

    recorder = new MediaRecorder(stream);
    console.log(recorder.getDisplayMedia)
    // console.log(event)
    console.log('开始录制')

    // For the sake of more legible code, this sample only uses the
    // `showSaveFilePicker()` method. In production, you need to
    // cater for browsers that don't support this method, as
    // outlined in https://web.dev/patterns/files/save-a-file/.

    // Prompt the user to choose where to save the recording file.
    const suggestedName = "screen-recording.webm";
    const types = [{ accept: { "video/webm": [".webm"] } }]
    const startIn = "videos";
    const handle = await window.showSaveFilePicker({ startIn, suggestedName, types });
    const writable = await handle.createWritable();

    // Start recording.
    recorder.start();
    recorder.addEventListener("dataavailable", async (event) => {
        // Write chunks to the file.
        await writable.write(event.data);
        if (recorder.state === "inactive") {
            // Close the file when the recording stops.
            await writable.close();
        }
    });
})

document.getElementById("endrecord").onclick = (event) => {
    console.log(event)
    console.log('结束录制')
    recorder.stop();
}