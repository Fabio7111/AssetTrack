package AssetTrack.service;

import AssetTrack.dto.LogAcessoResponseDTO;
import AssetTrack.model.LogAcesso;
import AssetTrack.model.Usuario;
import AssetTrack.repository.LogAcessoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogAcessoService {

    @Autowired
    private LogAcessoRepository logAcessoRepository;

    public void registrar(Usuario usuario, String acao) {
        LogAcesso log = new LogAcesso();
        log.setUsuario(usuario);
        log.setAcaoRealizada(acao);
        logAcessoRepository.save(log);
    }

    public List<LogAcessoResponseDTO> listarPorUsuario(Usuario usuario) {
        return logAcessoRepository
                .findByUsuarioOrderByDataHoraDesc(usuario)
                .stream()
                .map(LogAcessoResponseDTO::new)
                .toList();
    }
}