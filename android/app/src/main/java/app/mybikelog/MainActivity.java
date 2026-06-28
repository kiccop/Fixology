package app.mybikelog;

import android.app.DownloadManager;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Add JS interface for direct PDF download (callable from JavaScript)
        bridge.getWebView().addJavascriptInterface(new PdfDownloader(this), "AndroidPdfDownloader");

        // Add WebView download listener — intercepts any file download from the WebView
        // (anchor clicks, window.location.href to PDF URLs, etc.)
        bridge.getWebView().setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent,
                    String contentDisposition, String mimeType, long contentLength) {
                // Only handle PDF downloads; other files use default behavior
                if (mimeType != null && mimeType.equals("application/pdf")) {
                    downloadPdf(url, URLUtil.guessFileName(url, contentDisposition, mimeType));
                }
            }
        });
    }

    /**
     * Download a PDF from a URL directly to the Downloads folder using DownloadManager.
     */
    private void downloadPdf(String url, String filename) {
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        request.setMimeType("application/pdf");
        request.setTitle("myBikeLog - " + filename);
        request.setDescription("Libretto di manutenzione");
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "myBikeLog/" + filename);
        request.setAllowedOverMetered(true);
        request.setAllowedOverRoaming(true);

        DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        if (dm != null) {
            dm.enqueue(request);
        }
    }

    /**
     * JavaScript bridge for base64 PDF download.
     */
    public static class PdfDownloader {
        private final Context context;

        public PdfDownloader(Context context) {
            this.context = context.getApplicationContext();
        }

        @JavascriptInterface
        public void downloadBase64Pdf(String base64, String filename) {
            try {
                byte[] pdfBytes = Base64.decode(base64, Base64.DEFAULT);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
                    values.put(MediaStore.Downloads.MIME_TYPE, "application/pdf");
                    values.put(MediaStore.Downloads.IS_PENDING, 1);
                    values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/myBikeLog");

                    Uri uri = context.getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);

                    if (uri != null) {
                        try (OutputStream outputStream = context.getContentResolver().openOutputStream(uri)) {
                            if (outputStream != null) {
                                outputStream.write(pdfBytes);
                            }
                        }

                        values.clear();
                        values.put(MediaStore.Downloads.IS_PENDING, 0);
                        context.getContentResolver().update(uri, values, null, null);
                    }
                } else {
                    File dir = new File(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "myBikeLog");
                    if (!dir.exists()) {
                        dir.mkdirs();
                    }
                    File file = new File(dir, filename);
                    try (FileOutputStream outputStream = new FileOutputStream(file)) {
                        outputStream.write(pdfBytes);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
