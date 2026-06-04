package AssetTrack.service;

import AssetTrack.dto.DescarteRequestDTO;
import AssetTrack.dto.DescarteResponseDTO;
import AssetTrack.model.Descarte;
import AssetTrack.model.Equipamento;
import AssetTrack.model.Usuario;
import AssetTrack.repository.DescarteRepository;
import AssetTrack.repository.EquipamentoRepository;
import AssetTrack.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class DescarteService {

    @Autowired private DescarteRepository descarteRepository;
    @Autowired private EquipamentoRepository equipamentoRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    @Transactional
    public DescarteResponseDTO registrarDescarte(DescarteRequestDTO data) {
        Equipamento equipamento = equipamentoRepository.findById(data.idEquipamento())
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

        Usuario autorizador = usuarioRepository.findById(data.idUsuarioAutorizador())
                .orElseThrow(() -> new IllegalArgumentException("Usuário autorizador não encontrado."));

        if ("DESCARTADO".equalsIgnoreCase(equipamento.getStatusAtual())) {
            throw new IllegalArgumentException("Este equipamento já se encontra descartado.");
        }

        Descarte descarte = new Descarte();
        descarte.setEquipamento(equipamento);
        descarte.setAutorizador(autorizador);
        descarte.setMotivoDescarte(data.motivoDescarte());
        descarte.setDataDescarte(LocalDateTime.now());

        equipamento.setStatusAtual("DESCARTADO");
        equipamentoRepository.save(equipamento);

        descarteRepository.save(descarte);
        return new DescarteResponseDTO(descarte);
    }
}