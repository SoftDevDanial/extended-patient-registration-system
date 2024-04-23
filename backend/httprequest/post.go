package httprequest

import (
	"bytes"
	"encoding/json"
	"net/http"
)

func Post(requestUrl string, requestHeaders map[string]string, requestValues map[string]string) (*http.Response, error) {
	// Prepare Data
	jsonData, err := json.Marshal(requestValues)
	if err != nil {
		return nil, err
	}

	// Create Request
	req, err := http.NewRequest("POST", requestUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer req.Body.Close()

	// Set Headers
	for key, value := range requestHeaders {
		req.Header.Add(key, value)
	}

	// send request with headers
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	return res, nil

}
