import numpy as np
from flask import Blueprint, request, jsonify
from service.ConvertServices import perform_fft

convert_blueprint = Blueprint('convert', __name__)

@convert_blueprint.route('/convert', methods=['POST'])
def convert():
    data = request.get_json()
    frequencies, fft_result = perform_fft(data["xData"], data["yData"])
    return jsonify({
        "frequencies": frequencies.tolist(),
        "fft_result": np.abs(fft_result).tolist()
    })