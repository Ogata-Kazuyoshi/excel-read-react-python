import numpy as np

def perform_fft(time_data, intensity_data):
    fft_result = np.fft.fft(intensity_data)
    frequencies = np.fft.fftfreq(len(time_data), d=(time_data[1] - time_data[0]))
    return frequencies, fft_result

# time_data = np.arange(0, 10, 0.1)
# intensity_data = np.sin(2 * np.pi * 1 * time_data) + 0.5 * np.sin(2 * np.pi * 3 * time_data)

# frequencies, fft_result = perform_fft(time_data, intensity_data)

# print("Frequencies:", frequencies)
# print("FFT Result:", np.abs(fft_result))